"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = require("../controllers/upload.controller");
const upload_service_1 = require("../services/upload.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const uploadService = new upload_service_1.UploadService();
const uploadController = new upload_controller_1.UploadController(uploadService);
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|flac|m4a|mp4|avi|mov|pdf|doc|docx/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    }
});
router.post("/single", auth_1.authMiddleware, auth_1.requireStaff, upload.single('file'), (req, res) => uploadController.uploadSingle(req, res));
router.post("/multiple", auth_1.authMiddleware, auth_1.requireStaff, upload.array('files', 10), (req, res) => uploadController.uploadMultiple(req, res));
exports.default = router;
//# sourceMappingURL=upload.routes.js.map