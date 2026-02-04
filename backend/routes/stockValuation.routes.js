import express from "express";
import { getStockValuation } from "../controllers/stockValuation.controller.js";

const router = express.Router();

router.get("/", getStockValuation);

export default router;
