import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/newsletter — Public (visitor subscribes)
router.post("/", (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  try {
    const db = getDb();
    const existing = db.prepare("SELECT id FROM newsletter_subscribers WHERE email = ?").get(email.toLowerCase().trim());

    if (existing) {
      return res.status(200).json({ ok: true, alreadySubscribed: true });
    }

    db.prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)").run(email.toLowerCase().trim());
    console.log(`📧 [NEWSLETTER] New subscriber: ${email}`);

    res.status(201).json({ ok: true, alreadySubscribed: false });
  } catch (err: any) {
    console.error("❌ [NEWSLETTER] Failed to save subscriber:", err.message);
    res.status(500).json({ error: "Failed to subscribe. Please try again." });
  }
});

// GET /api/newsletter — Admin
router.get("/", requireAdmin, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const subscribers = db.prepare("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC").all();
  res.json(subscribers);
});

// DELETE /api/newsletter/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM newsletter_subscribers WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Subscriber not found" });
  res.json({ ok: true });
});

export default router;
