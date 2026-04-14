import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/fixtures — Public (upcoming)
router.get("/", (_req: Request, res: Response) => {
  const db = getDb();
  const fixtures = db.prepare("SELECT * FROM fixtures WHERE is_upcoming = 1 ORDER BY id").all();
  res.json(fixtures);
});

// GET /api/results — Public (past results)
router.get("/results", (_req: Request, res: Response) => {
  const db = getDb();
  const results = db.prepare("SELECT * FROM fixtures WHERE is_upcoming = 0 ORDER BY id DESC").all();
  res.json(results);
});

// GET /api/fixtures/all — Admin (all fixtures)
router.get("/all", requireAdmin, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const all = db.prepare("SELECT * FROM fixtures ORDER BY is_upcoming DESC, id DESC").all();
  res.json(all);
});

// GET /api/standings — Public
router.get("/standings", (_req: Request, res: Response) => {
  const db = getDb();
  const standings = db.prepare("SELECT * FROM standings ORDER BY pos").all();
  res.json(standings);
});

// POST /api/fixtures — Admin
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  const { date, time, opponent, opp_logo, type, venue, comp, result, score, is_upcoming } = req.body;
  if (!date || !time || !opponent) {
    return res.status(400).json({ error: "Date, time, and opponent are required" });
  }

  const db = getDb();
  const r = db.prepare(`INSERT INTO fixtures (date, time, opponent, opp_logo, type, venue, comp, result, score, is_upcoming) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    date, time, opponent,
    opp_logo || opponent.substring(0, 2).toUpperCase(),
    type || "Home",
    venue || "Brooklyn Park, Minnesota",
    comp || "ADH Super League",
    result || null,
    score || null,
    is_upcoming !== undefined ? is_upcoming : 1
  );

  const fixture = db.prepare("SELECT * FROM fixtures WHERE id = ?").get(r.lastInsertRowid);
  res.status(201).json(fixture);
});

// PUT /api/fixtures/:id — Admin
router.put("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM fixtures WHERE id = ?").get(id) as any;
  if (!existing) return res.status(404).json({ error: "Fixture not found" });

  const { date, time, opponent, opp_logo, type, venue, comp, result, score, is_upcoming } = req.body;

  db.prepare(`UPDATE fixtures SET date = ?, time = ?, opponent = ?, opp_logo = ?, type = ?, venue = ?, comp = ?, result = ?, score = ?, is_upcoming = ? WHERE id = ?`).run(
    date ?? existing.date,
    time ?? existing.time,
    opponent ?? existing.opponent,
    opp_logo ?? existing.opp_logo,
    type ?? existing.type,
    venue ?? existing.venue,
    comp ?? existing.comp,
    result !== undefined ? result : existing.result,
    score !== undefined ? score : existing.score,
    is_upcoming !== undefined ? is_upcoming : existing.is_upcoming,
    id
  );

  const updated = db.prepare("SELECT * FROM fixtures WHERE id = ?").get(id);
  res.json(updated);
});

// DELETE /api/fixtures/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM fixtures WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Fixture not found" });
  res.json({ ok: true });
});

// PUT /api/standings/:id — Admin
router.put("/standings/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM standings WHERE id = ?").get(id) as any;
  if (!existing) return res.status(404).json({ error: "Standing not found" });

  const { pos, team, gp, w, l, d, gf, ga, gd, pts, is_us } = req.body;
  db.prepare("UPDATE standings SET pos = ?, team = ?, gp = ?, w = ?, l = ?, d = ?, gf = ?, ga = ?, gd = ?, pts = ?, is_us = ? WHERE id = ?").run(
    pos ?? existing.pos, team ?? existing.team, gp ?? existing.gp,
    w ?? existing.w, l ?? existing.l, d ?? existing.d,
    gf ?? existing.gf, ga ?? existing.ga, gd ?? existing.gd,
    pts ?? existing.pts, is_us !== undefined ? is_us : existing.is_us, id
  );

  const updated = db.prepare("SELECT * FROM standings WHERE id = ?").get(id);
  res.json(updated);
});

export default router;
