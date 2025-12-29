import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import logger from "../../../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      // Allow anonymous users
      socket.data = {
        userId: null,
        username: "Anonymous",
        userType: "anonymous"
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      userType: "user" | "staff";
    };

    if (decoded.userType === "staff") {
      const staff = await prisma.staff.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          role: true,
          isActive: true,
          isApproved: true,
        },
      });

      if (staff && staff.isActive && staff.isApproved) {
        socket.data = {
          userId: staff.id,
          username: staff.username || `${staff.firstName} ${staff.lastName}`,
          userType: "staff",
          role: staff.role
        };
      }
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          username: true,
          isActive: true,
          isSuspended: true,
        },
      });

      if (user && user.isActive && !user.isSuspended) {
        socket.data = {
          userId: user.id,
          username: user.username || user.name || "User",
          userType: "user"
        };
      }
    }

    next();
  } catch (error) {
    logger.debug("Socket auth error", { error });
    // Allow connection but as anonymous
    socket.data = {
      userId: null,
      username: "Anonymous",
      userType: "anonymous"
    };
    next();
  }
}