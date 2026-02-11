import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoiceFromTimesheets,
  markInvoicePaid,
  getInvoicesByCustomer,
  getMonthlySales
} from "../controllers/invoice.controller.js";

const router = express.Router();
router.use(protect);

// Specific routes first
router.get("/monthly-sales", getMonthlySales);
router.get("/customer/:customerId", getInvoicesByCustomer);

// Basic CRUD
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
router.put("/:id/mark-paid", markInvoicePaid);

router.post("/generate/from-timesheets", generateInvoiceFromTimesheets);

export default router;
