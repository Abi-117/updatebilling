import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createRecurringInvoice,
  getRecurringInvoices,
  updateRecurringInvoice,
  deleteRecurringInvoice,
  sendRecurringInvoice,
} from "../controllers/recurring.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getRecurringInvoices);
router.post("/", createRecurringInvoice);
router.put("/:id", updateRecurringInvoice);
router.delete("/:id", deleteRecurringInvoice);
router.post("/:id/send", sendRecurringInvoice);

export default router;
