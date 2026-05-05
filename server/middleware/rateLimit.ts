import { Request, Response, NextFunction } from "express";

export function rateLimit(maxRequests: number, windowMs: number) {
  const store = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "unknown";
    const now = Date.now();
    const entry = store.get(ip);

    if (entry && now < entry.resetAt) {
      entry.count++;
      if (entry.count > maxRequests) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }
    } else {
      store.set(ip, { count: 1, resetAt: now + windowMs });
    }
    next();
  };
}
