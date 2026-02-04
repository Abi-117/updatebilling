import express from "express";
import { getTimesheets, createTimesheet, updateTimesheet, deleteTimesheet } from "../controllers/timesheetController.js";

const router = express.Router();
router.get("/", getTimesheets);
router.post("/", createTimesheet);
router.put("/:id", updateTimesheet);
router.delete("/:id", deleteTimesheet);
export default router;