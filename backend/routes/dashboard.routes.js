import express from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/metrics", protect, async (req, res) => {
  res.json({
    revenue: { value: 0, growth: 0 },
    mrr: { value: 0, growth: 0 },
    arpu: { value: 0, growth: 0 },
    ltv: { value: 0, growth: 0 },
    subscriptions: { value: 0, growth: 0 },
  });
});

export default router;
