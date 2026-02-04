import express from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  saveItemPricing,
  getItemPricing,
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

router.put("/:itemId/pricing", saveItemPricing);
router.get("/:itemId/pricing", getItemPricing);

export default router;
