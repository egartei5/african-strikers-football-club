import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/contact — Public
router.post("/", (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const db = getDb();
  db.prepare("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)").run(name, email, subject, message);
  res.status(201).json({ ok: true, message: "Message sent successfully" });
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
