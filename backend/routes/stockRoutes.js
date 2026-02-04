import express from "express";
import {
  getStockLogs,
  addStockLog,
} from "../controllers/stockController.js";
import { protect, protectAdmin } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", protect, getStockLogs);
router.post("/", protect, addStockLog);

export default router;
