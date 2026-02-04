import express from "express";
import { getRecurringExpenses, createRecurringExpense, updateRecurringExpense, deleteRecurringExpense } from "../controllers/recurringExpenseController.js";
const router = express.Router();

router.get("/", getRecurringExpenses);
router.post("/", createRecurringExpense);
router.put("/:id", updateRecurringExpense);
router.delete("/:id", deleteRecurringExpense);

export default router;
