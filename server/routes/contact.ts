import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { sendContactNotification, sendContactAutoReply } from "../email";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact — Public (visitor submits contact form)
router.post("/", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (typeof name !== "string" || name.length > 100) return res.status(400).json({ error: "Name must be 100 characters or fewer" });
  if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: "A valid email address is required" });
  if (typeof subject !== "string" || subject.length > 200) return res.status(400).json({ error: "Subject must be 200 characters or fewer" });
  if (typeof message !== "string" || message.length > 5000) return res.status(400).json({ error: "Message must be 5000 characters or fewer" });


  try {
    const db = getDb();
    db.prepare("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)").run(
      name, email, subject, message
    );

    console.log(`📬 [CONTACT] New message saved: ${name} (${email}) — Subject: ${subject}`);

    // Send notification to admin + auto-reply to sender in parallel
    const [notifyResult, replyResult] = await Promise.all([
      sendContactNotification(name, email, subject, message),
      sendContactAutoReply(email, name),
    ]);

    res.status(201).json({
      ok: true,
      message: "Message sent successfully",
      adminNotified: notifyResult.sent,
      autoReplySent: replyResult.sent,
    });
  } catch (err: any) {
    console.error("❌ [CONTACT] Failed to process contact form:", err.message);
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

// GET /api/contact — Admin
router.get("/", requireAdmin, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const contacts = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();
  res.json(contacts);
});

// PUT /api/contact/:id/read — Admin
router.put("/:id/read", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("UPDATE contacts SET is_read = 1 WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Contact not found" });
  res.json({ ok: true });
});

// DELETE /api/contact/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Contact not found" });
  res.json({ ok: true });
});

export default router;
