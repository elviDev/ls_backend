import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import logger from "../../../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    // Get IP address from socket
    const ipAddress = socket.handshake.headers['x-forwarded-for'] as string || 
                     socket.handshake.headers['x-real-ip'] as string ||
                     socket.handshake.address;

    if (!token) {
      // Allow anonymous users with IP tracking
      const ipLast3 = ipAddress?.split('.').slice(-1)[0] || Math.floor(Math.random() * 1000);
      const anonymousId = `anon_${ipAddress?.replace(/[.:]/g, '_')}_${Date.now()}`;
      socket.data = {
        userId: anonymousId,
        username: `Anonymous User #${ipLast3}`,
        userType: "anonymous",
        ipAddress: ipAddress
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
          role: staff.role,
          ipAddress: ipAddress
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
          userType: "user",
          ipAddress: ipAddress
        };
      }
    }

    next();
  } catch (error) {
    logger.debug("Socket auth error", { error });
    // Allow connection but as anonymous with IP tracking
    const ipAddress = socket.handshake.headers['x-forwarded-for'] as string || 
                     socket.handshake.headers['x-real-ip'] as string ||
                     socket.handshake.address;
    const ipLast3 = ipAddress?.split('.').slice(-1)[0] || Math.floor(Math.random() * 1000);
    const anonymousId = `anon_${ipAddress?.replace(/[.:]/g, '_')}_${Date.now()}`;
    socket.data = {
      userId: anonymousId,
      username: `Anonymous User #${ipLast3}`,
      userType: "anonymous",
      ipAddress: ipAddress
    };
    next();
  }
}