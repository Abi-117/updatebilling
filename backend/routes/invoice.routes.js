import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoiceFromTimesheets,
  markInvoicePaid
} from "../controllers/invoice.controller.js";

const router = express.Router();
router.use(protect);

// Basic CRUD
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
router.put("/:id/mark-paid", markInvoicePaid);
router.post("/generate/from-timesheets", generateInvoiceFromTimesheets);

export default router;
