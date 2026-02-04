import express from "express";
import { getReceivableSummary } from "../controllers/receivable.controller.js";
import { protect, protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/summary", protect, protectAdmin, getReceivableSummary);

export default router;
