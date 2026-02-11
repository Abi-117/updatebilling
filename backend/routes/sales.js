import express from "express";
import { getInvoices, getMonthlySales } from "../controllers/salesController.js";

const router = express.Router();

// GET /api/sales/invoices
router.get("/invoices", getInvoices);

// GET /api/sales/monthly
router.get("/monthly", getMonthlySales);

export default router;
