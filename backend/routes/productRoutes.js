import express from "express";
import { savePricing, saveTax } from "../controllers/productController.js";

const router = express.Router();

// Save pricing
router.put("/pricing/:productId", savePricing);

// Save tax
router.put("/tax/:productId", saveTax);

export default router;
