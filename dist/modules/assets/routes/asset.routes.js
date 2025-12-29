"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const asset_controller_1 = require("../controllers/asset.controller");
const asset_service_1 = require("../services/asset.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const assetService = new asset_service_1.AssetService();
const assetController = new asset_controller_1.AssetController(assetService);
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
});
router.get("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => assetController.getAssets(req, res));
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, upload.fields([{ name: 'file', maxCount: 1 }]), (req, res) => assetController.createAsset(req, res));
router.get("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => assetController.getAssetById(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => assetController.updateAsset(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => assetController.deleteAsset(req, res));
exports.default = router;
//# sourceMappingURL=asset.routes.js.map