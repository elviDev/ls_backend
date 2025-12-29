"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = require("../utils/logger");
const environment_1 = require("../config/environment");
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const startTime = Date.now();
        try {
            const response = await (0, node_fetch_1.default)(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
            });
            const duration = Date.now() - startTime;
            if (!response.ok) {
                logger_1.logger.error("API request failed", {
                    url,
                    status: response.status,
                    duration,
                });
                throw new Error(`API request failed: ${response.status}`);
            }
            logger_1.logger.debug("API request completed", {
                url,
                status: response.status,
                duration,
            });
            return (await response.json());
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.error("API request error", { url, duration, error });
            throw error;
        }
    }
    async get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    }
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}
exports.apiClient = new ApiClient(environment_1.config.frontendUrl);
//# sourceMappingURL=api-client.js.map