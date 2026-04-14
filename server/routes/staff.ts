import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/staff — Public
router.get("/", (_req: Request, res: Response) => {
  const db = getDb();
  const staff = db.prepare("SELECT * FROM staff WHERE is_active = 1 ORDER BY sort_order").all();
  res.json(staff);
});

// GET /api/staff/all — Admin (includes inactive)
router.get("/all", requireAdmin, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const staff = db.prepare("SELECT * FROM staff ORDER BY sort_order").all();
  res.json(staff);
});

// POST /api/staff — Admin
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  const { name, role, category, sort_order } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "Name and role are required" });
  }

  const db = getDb();
  const maxOrder = (db.prepare("SELECT MAX(sort_order) as max FROM staff").get() as any)?.max || 0;
  const result = db.prepare("INSERT INTO staff (name, role, category, sort_order) VALUES (?, ?, ?, ?)").run(
    name, role, category || "Leadership", sort_order ?? maxOrder + 1
  );
  const member = db.prepare("SELECT * FROM staff WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(member);
});

// PUT /api/staff/:id — Admin
router.put("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM staff WHERE id = ?").get(id) as any;
  if (!existing) return res.status(404).json({ error: "Staff member not found" });

  const { name, role, category, sort_order, is_active } = req.body;
  db.prepare("UPDATE staff SET name = ?, role = ?, category = ?, sort_order = ?, is_active = ? WHERE id = ?").run(
    name ?? existing.name,
    role ?? existing.role,
    category ?? existing.category,
    sort_order ?? existing.sort_order,
    is_active !== undefined ? is_active : existing.is_active,
    id
  );

  const updated = db.prepare("SELECT * FROM staff WHERE id = ?").get(id);
  res.json(updated);
});

// DELETE /api/staff/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM staff WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Staff member not found" });
  res.json({ ok: true });
});

export default router;
