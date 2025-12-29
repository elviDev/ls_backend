import { Router } from "express";
import multer from "multer";
import { AssetController } from "../controllers/asset.controller";
import { AssetService } from "../services/asset.service";
import { authMiddleware, requireStaff } from "../../../middleware/auth";

const router = Router();
const assetService = new AssetService();
const assetController = new AssetController(assetService);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

router.get("/", authMiddleware, requireStaff, (req, res) => assetController.getAssets(req, res));
router.post("/", authMiddleware, requireStaff, upload.fields([{ name: 'file', maxCount: 1 }]), (req, res) => assetController.createAsset(req, res));
router.post("/upload", authMiddleware, requireStaff, upload.array('files'), (req, res) => assetController.uploadMultiple(req, res));
router.post("/upload-multiple", authMiddleware, requireStaff, upload.array('files'), (req, res) => assetController.uploadMultiple(req, res));
router.get("/:id", authMiddleware, requireStaff, (req, res) => assetController.getAssetById(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => assetController.updateAsset(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => assetController.deleteAsset(req, res));

export default router;