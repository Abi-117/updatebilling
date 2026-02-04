import express from "express";
import {
  getBillingEvents,
  markEventPaid,
} from "../controllers/billingEvent.controller.js";

const router = express.Router();

router.get("/", getBillingEvents);
router.patch("/:id/pay", markEventPaid);

export default router;
