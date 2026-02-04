import express from "express";
import {
  getEstimates,
  getEstimate,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  convertEstimateToInvoice,
} from "../controllers/estimate.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getEstimates);
router.get("/:id", getEstimate);
router.post("/", createEstimate);
router.put("/:id", updateEstimate);
router.delete("/:id", deleteEstimate);
router.post("/:id/convert", convertEstimateToInvoice);

export default router;
