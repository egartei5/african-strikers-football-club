import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";
import { sendWelcomeEmail, sendRejectionEmail } from "../email";

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

  let playerAdded = false;

  // When accepted: add to the players roster automatically
  if (status === "accepted" && existing.status !== "accepted") {
    // Check if the player already exists in the roster (by name)
    const existingPlayer = db.prepare("SELECT id FROM players WHERE name = ?").get(existing.full_name);
    if (!existingPlayer) {
      // Find the next available jersey number
      const maxNum = db.prepare("SELECT MAX(CAST(number AS INTEGER)) as maxNum FROM players").get() as any;
      const nextNumber = String((maxNum?.maxNum || 22) + 1);

      db.prepare("INSERT INTO players (name, position, number, role, is_active) VALUES (?, ?, ?, ?, 1)").run(
        existing.full_name,
        existing.position,
        nextNumber,
        null
      );
      playerAdded = true;
      console.log(`✅ Player "${existing.full_name}" added to roster as #${nextNumber} (${existing.position})`);
    }

    // Send welcome email
    sendWelcomeEmail(existing.email, existing.full_name, existing.position)
      .then((sent) => {
        if (sent) console.log(`✅ Welcome email queued for ${existing.full_name} (${existing.email})`);
      })
      .catch((err) => console.error("❌ Email error:", err));
  }

  // If un-accepting (changing away from accepted), remove auto-added player
  if (existing.status === "accepted" && status !== "accepted") {
    db.prepare("DELETE FROM players WHERE name = ? AND role IS NULL").run(existing.full_name);
    console.log(`🗑️ Removed "${existing.full_name}" from roster (status changed to ${status})`);
  }

  // Send rejection email when application is rejected
  if (status === "rejected" && existing.status !== "rejected") {
    sendRejectionEmail(existing.email, existing.full_name, existing.position)
      .then((sent) => {
        if (sent) console.log(`📧 Rejection email queued for ${existing.full_name} (${existing.email})`);
      })
      .catch((err) => console.error("❌ Email error:", err));
  }

  const updated = db.prepare("SELECT * FROM applications WHERE id = ?").get(id);
  res.json({
    ...updated as object,
    playerAdded,
    emailSent: (status === "accepted" && existing.status !== "accepted") || (status === "rejected" && existing.status !== "rejected"),
  });
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
