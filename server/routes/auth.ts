import { Router, Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "../db";

const router = Router();

// Session duration: 24 hours
const SESSION_DURATION_HOURS = 24;

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const db = getDb();

  const admin = db.prepare("SELECT id, username, password_hash FROM admin WHERE username = ?").get(username) as { id: number; username: string; password_hash: string } | undefined;

  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Support legacy SHA-256 hashes and transparently upgrade to bcrypt on login
  const isSha256 = /^[a-f0-9]{64}$/.test(admin.password_hash);
  let valid = false;
  if (isSha256) {
    const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
    valid = legacyHash === admin.password_hash;
    if (valid) {
      const upgraded = bcrypt.hashSync(password, 12);
      db.prepare("UPDATE admin SET password_hash = ? WHERE id = ?").run(upgraded, admin.id);
    }
  } else {
    valid = bcrypt.compareSync(password, admin.password_hash);
  }

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate session token with expiry
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, datetime('now', ?))").run(
    token, admin.id, `+${SESSION_DURATION_HOURS} hours`
  );

  res.json({ token, username: admin.username });
});

// GET /api/auth/me
router.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.slice(7);
  const db = getDb();

  const session = db.prepare(`
    SELECT a.id, a.username 
    FROM sessions s 
    JOIN admin a ON s.admin_id = a.id 
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as { id: number; username: string } | undefined;

  if (!session) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  res.json({ id: session.id, username: session.username });
});

// POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  res.json({ ok: true });
});

// PUT /api/auth/password
router.put("/password", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.slice(7);
  const db = getDb();

  const session = db.prepare("SELECT admin_id FROM sessions WHERE token = ? AND expires_at > datetime('now')").get(token) as { admin_id: number } | undefined;
  if (!session) return res.status(401).json({ error: "Invalid or expired token" });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new passwords required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  const adminRow = db.prepare("SELECT id, password_hash FROM admin WHERE id = ?").get(session.admin_id) as { id: number; password_hash: string } | undefined;
  if (!adminRow) return res.status(401).json({ error: "Admin not found" });

  const isSha256 = /^[a-f0-9]{64}$/.test(adminRow.password_hash);
  const currentValid = isSha256
    ? crypto.createHash("sha256").update(currentPassword).digest("hex") === adminRow.password_hash
    : bcrypt.compareSync(currentPassword, adminRow.password_hash);
  if (!currentValid) return res.status(401).json({ error: "Current password is incorrect" });

  const newHash = bcrypt.hashSync(newPassword, 12);
  db.prepare("UPDATE admin SET password_hash = ? WHERE id = ?").run(newHash, session.admin_id);

  // Invalidate all other sessions for this admin (force re-login)
  db.prepare("DELETE FROM sessions WHERE admin_id = ? AND token != ?").run(session.admin_id, token);

  res.json({ ok: true });
});

export default router;
