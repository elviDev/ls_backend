import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import logger from "../utils/logger";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  profileImage?: string | null;
  userType: "user" | "staff";
  role?: string;
  isApproved?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      userType: "user" | "staff";
    };

    if (decoded.userType === "staff") {
      const staff = await prisma.staff.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          profileImage: true,
          role: true,
          isActive: true,
          isApproved: true,
        },
      });

      if (staff && staff.isActive && staff.isApproved) {
        req.user = {
          id: staff.id,
          email: staff.email,
          name: `${staff.firstName} ${staff.lastName}`,
          username: staff.username,
          profileImage: staff.profileImage,
          userType: "staff",
          role: staff.role,
          isApproved: staff.isApproved,
        };
      }
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          profileImage: true,
          isActive: true,
          isSuspended: true,
        },
      });

      if (user && user.isActive && !user.isSuspended) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          profileImage: user.profileImage,
          userType: "user",
        };
      }
    }

    next();
  } catch (error) {
    logger.debug("Auth middleware error", { error });
    next();
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function requireStaff(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(req.user);

  if (!req.user || req.user.userType !== "staff") {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }

  // Admin is considered staff
  const staffRoles = ["ADMIN", "HOST", "CO_HOST", "PRODUCER", "MODERATOR"];
  if (!req.user.role || !staffRoles.includes(req.user.role)) {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }
  console.log("Here!!!!");
  next();
}

export function requireModerator(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.userType !== "staff") {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }

  const moderatorRoles = ["ADMIN", "HOST", "PRODUCER"];
  if (!req.user.role || !moderatorRoles.includes(req.user.role)) {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }

  next();
}
