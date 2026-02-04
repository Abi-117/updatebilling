import express from "express";
import { getSupplierPayments } from "../controllers/supplierPaymentController.js";

const router = express.Router();

router.get("/supplier-payments", getSupplierPayments);

export default router;
