import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/players — Public
router.get("/", (req: Request, res: Response) => {
  const db = getDb();
  const featured = req.query.featured === "true";

  let players;
  if (featured) {
    // Return featured attacking players for the home page
    players = db.prepare("SELECT * FROM players WHERE is_active = 1 AND position IN ('Striker', 'Winger', 'Attacking Midfielder') ORDER BY CAST(number AS INTEGER) LIMIT 4").all();
  } else {
    players = db.prepare("SELECT * FROM players WHERE is_active = 1 ORDER BY CASE position WHEN 'Goalkeeper' THEN 1 WHEN 'Right Back / Left Back' THEN 2 WHEN 'Center Back' THEN 3 WHEN 'Left Back' THEN 4 WHEN 'Midfield' THEN 5 WHEN 'Attacking Midfielder' THEN 6 WHEN 'Winger' THEN 7 WHEN 'Striker' THEN 8 ELSE 9 END, CAST(number AS INTEGER)").all();
  }

  res.json(players);
});

// GET /api/players/all — Admin (includes inactive)
router.get("/all", requireAdmin, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const players = db.prepare("SELECT * FROM players ORDER BY is_active DESC, CAST(number AS INTEGER)").all();
  res.json(players);
});

// POST /api/players — Admin
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  const { name, position, number, role } = req.body;
  if (!name || !position || !number) {
    return res.status(400).json({ error: "Name, position, and number are required" });
  }

  const db = getDb();
  const result = db.prepare("INSERT INTO players (name, position, number, role) VALUES (?, ?, ?, ?)").run(name, position, number, role || null);
  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(player);
});

// PUT /api/players/:id — Admin
router.put("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, position, number, role, is_active } = req.body;

  const db = getDb();
  const existing = db.prepare("SELECT * FROM players WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Player not found" });

  db.prepare("UPDATE players SET name = ?, position = ?, number = ?, role = ?, is_active = ? WHERE id = ?").run(
    name ?? (existing as any).name,
    position ?? (existing as any).position,
    number ?? (existing as any).number,
    role !== undefined ? role : (existing as any).role,
    is_active !== undefined ? is_active : (existing as any).is_active,
    id
  );

  const updated = db.prepare("SELECT * FROM players WHERE id = ?").get(id);
  res.json(updated);
});

// DELETE /api/players/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM players WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Player not found" });
  res.json({ ok: true });
});

export default router;
