import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { sendWelcomeEmail } from "../email";

const router = Router();

// POST /api/applications — Public
router.post("/", (req: Request, res: Response) => {
  const { full_name, age, email, phone, position, experience, message } = req.body;
  if (!full_name || !age || !email || !phone || !position || !experience) {
    return res.status(400).json({ error: "All required fields must be filled" });
  }

  const db = getDb();
  db.prepare("INSERT INTO applications (full_name, age, email, phone, position, experience, message) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    full_name, age, email, phone, position, experience, message || null
  );
  res.status(201).json({ ok: true, message: "Application submitted successfully" });
});

// GET /api/applications — Admin
router.get("/", requireAdmin, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const applications = db.prepare("SELECT * FROM applications ORDER BY created_at DESC").all();
  res.json(applications);
});

// PUT /api/applications/:id/status — Admin
router.put("/:id/status", requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !["pending", "reviewed", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Valid status required: pending, reviewed, accepted, rejected" });
  }

  const db = getDb();
  const existing = db.prepare("SELECT * FROM applications WHERE id = ?").get(id) as any;
  if (!existing) return res.status(404).json({ error: "Application not found" });

  db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);

  // Send welcome email when application is accepted
  if (status === "accepted" && existing.status !== "accepted") {
    sendWelcomeEmail(existing.email, existing.full_name, existing.position)
      .then((sent) => {
        if (sent) console.log(`✅ Welcome email queued for ${existing.full_name} (${existing.email})`);
      });
  }

  const updated = db.prepare("SELECT * FROM applications WHERE id = ?").get(id);
  res.json({ ...updated as object, emailSent: status === "accepted" && existing.status !== "accepted" });
});

// DELETE /api/applications/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM applications WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Application not found" });
  res.json({ ok: true });
});

export default router;
