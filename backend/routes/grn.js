import express from "express";
import {
  fetchGRNs,
  createGRN,
  updateGRN,
  deleteGRN,
  createBillFromGRN
} from "../controllers/grnController.js";

const router = express.Router();

router.get("/", fetchGRNs);
router.post("/", createGRN);
router.put("/:id", updateGRN);
router.delete("/:id", deleteGRN);

// ✅ THIS LINE WAS MISSING / WRONG BEFORE
router.post("/:id/create-bill", createBillFromGRN);

export default router;
