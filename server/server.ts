import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { getDb } from "./db";
import { verifyEmailConfig } from "./email";

// Load env vars
dotenv.config();

// Route imports
import authRoutes from "./routes/auth";
import playerRoutes from "./routes/players";
import fixtureRoutes from "./routes/fixtures";
import newsRoutes from "./routes/news";
import contactRoutes from "./routes/contact";
import applicationRoutes from "./routes/applications";
import staffRoutes from "./routes/staff";

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

// ─── CORS ────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ─── Security headers ───────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (isProd) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// ─── Rate limiting (basic) ──────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window

app.use("/api/auth/login", (req, res, next) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetAt) {
    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
      return res.status(429).json({ error: "Too many requests. Try again later." });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }
  next();
});

// Initialize database
getDb();
console.log("📦 Database initialized");

// Verify email configuration at startup
verifyEmailConfig().catch((err) => {
  console.error("❌ Email config verification failed:", err.message);
});

// ─── API Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/staff", staffRoutes);

// ─── Health check endpoint ──────────────────────────────────────
app.get("/api/health", (_req, res) => {
  const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const adminEmailSet = !!process.env.ADMIN_EMAIL;

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    email: {
      smtpConfigured,
      adminEmailSet,
      from: process.env.SMTP_FROM ? "set" : "default",
    },
  });
});

// ─── Dashboard stats endpoint ───────────────────────────────────
app.get("/api/stats", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.slice(7);
  const db = getDb();
  const session = db.prepare("SELECT admin_id FROM sessions WHERE token = ?").get(token);
  if (!session) return res.status(401).json({ error: "Invalid token" });

  const players = (db.prepare("SELECT COUNT(*) as count FROM players WHERE is_active = 1").get() as any).count;
  const fixtures = (db.prepare("SELECT COUNT(*) as count FROM fixtures WHERE is_upcoming = 1").get() as any).count;
  const news = (db.prepare("SELECT COUNT(*) as count FROM news").get() as any).count;
  const unreadContacts = (db.prepare("SELECT COUNT(*) as count FROM contacts WHERE is_read = 0").get() as any).count;
  const totalContacts = (db.prepare("SELECT COUNT(*) as count FROM contacts").get() as any).count;
  const pendingApplications = (db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'").get() as any).count;
  const totalApplications = (db.prepare("SELECT COUNT(*) as count FROM applications").get() as any).count;
  const staff = (db.prepare("SELECT COUNT(*) as count FROM staff WHERE is_active = 1").get() as any).count;

  res.json({ players, fixtures, news, unreadContacts, totalContacts, pendingApplications, totalApplications, staff });
});

// ─── Serve frontend in production ───────────────────────────────
if (isProd) {
  const distPath = path.resolve(process.cwd(), "dist");
  app.use(express.static(distPath, {
    maxAge: "1y",
    etag: true,
  }));
  // SPA fallback — serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── Periodic cleanup ───────────────────────────────────────────
// Clean expired sessions every hour
setInterval(() => {
  try {
    const db = getDb();
    const deleted = db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
    if (deleted.changes > 0) {
      console.log(`🧹 Cleaned ${deleted.changes} expired session(s)`);
    }
  } catch { /* ignore */ }
}, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`\n⚽ African Strikers FC API running on port ${PORT}`);
  console.log(`   Mode: ${isProd ? "PRODUCTION" : "DEVELOPMENT"}`);
  if (!isProd) {
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Routes: /api/auth, /api/players, /api/fixtures, /api/news, /api/contact, /api/applications, /api/staff`);
  }
});
