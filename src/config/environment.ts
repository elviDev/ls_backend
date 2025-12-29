import "dotenv/config";

export const config = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || "https://lsfrontend-production.up.railway.app",
  nodeEnv: process.env.NODE_ENV || "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
