"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    port: process.env.PORT || 3001,
    frontendUrl: process.env.FRONTEND_URL || "https://lsfrontend-production.up.railway.app",
    nodeEnv: process.env.NODE_ENV || "production",
    isDevelopment: process.env.NODE_ENV === "development",
};
//# sourceMappingURL=environment.js.map