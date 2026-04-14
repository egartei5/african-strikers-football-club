import { Request, Response, NextFunction } from "express";
import { getDb } from "../db";

export interface AuthRequest extends Request {
  adminId?: number;
  adminUsername?: string;
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.slice(7);
  const db = getDb();

  const session = db.prepare(`
    SELECT s.admin_id, a.username 
    FROM sessions s 
    JOIN admin a ON s.admin_id = a.id 
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as { admin_id: number; username: string } | undefined;

  if (!session) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.adminId = session.admin_id;
  req.adminUsername = session.username;
  next();
}
