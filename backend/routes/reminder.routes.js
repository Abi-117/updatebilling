import express from "express";
import {
  getReminders,
  createReminder,
  updateReminderStatus,
  deleteReminder,
} from "../controllers/reminder.controller.js";

const router = express.Router();

router.get("/", getReminders);
router.post("/", createReminder);
router.patch("/:id", updateReminderStatus);
router.delete("/:id", deleteReminder);

export default router;
