import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/news — Public
router.get("/", (_req: Request, res: Response) => {
  const db = getDb();
  const articles = db.prepare("SELECT * FROM news ORDER BY id DESC").all();
  res.json(articles);
});

// POST /api/news — Admin
router.post("/", requireAdmin, (req: AuthRequest, res: Response) => {
  const { title, excerpt, date, author, category, img } = req.body;
  if (!title || !excerpt || !date) {
    return res.status(400).json({ error: "Title, excerpt, and date are required" });
  }

  const db = getDb();
  const result = db.prepare("INSERT INTO news (title, excerpt, date, author, category, img) VALUES (?, ?, ?, ?, ?, ?)").run(
    title, excerpt, date, author || "Media Team", category || "General", img || null
  );

  const article = db.prepare("SELECT * FROM news WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(article);
});

// PUT /api/news/:id — Admin
router.put("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM news WHERE id = ?").get(id) as any;
  if (!existing) return res.status(404).json({ error: "Article not found" });

  const { title, excerpt, date, author, category, img } = req.body;
  db.prepare("UPDATE news SET title = ?, excerpt = ?, date = ?, author = ?, category = ?, img = ? WHERE id = ?").run(
    title ?? existing.title,
    excerpt ?? existing.excerpt,
    date ?? existing.date,
    author ?? existing.author,
    category ?? existing.category,
    img !== undefined ? img : existing.img,
    id
  );

  const updated = db.prepare("SELECT * FROM news WHERE id = ?").get(id);
  res.json(updated);
});

// DELETE /api/news/:id — Admin
router.delete("/:id", requireAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const result = db.prepare("DELETE FROM news WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Article not found" });
  res.json({ ok: true });
});

export default router;
