import express from "express";
import {
  createPaymentLink,
  getPaymentLinks,
  getPublicPaymentLink
} from "../controllers/paymentLinkController.js";

const router = express.Router();

router.post("/", createPaymentLink);
router.get("/", getPaymentLinks);
router.get("/public/:linkId", getPublicPaymentLink);



export default router;
