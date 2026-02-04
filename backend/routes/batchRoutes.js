// batchRoutes.js
import express from "express";
import { getBatches, createBatch, updateBatch, deleteBatch } from "../controllers/batchController.js";
const router = express.Router();

router.get("/", getBatches);
router.post("/", createBatch);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

export default router;
