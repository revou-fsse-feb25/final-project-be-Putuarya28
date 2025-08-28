import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email?: string; role?: string };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(); // Allow guests to proceed
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email?: string;
      role?: string;
    };
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
