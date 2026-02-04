import express from "express";
import {
  getLowStockRule,
  saveLowStockRule,
} from "../controllers/lowStockController.js";

const router = express.Router();

router.get("/:itemId", getLowStockRule);
router.put("/:itemId", saveLowStockRule);

export default router;
