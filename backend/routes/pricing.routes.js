import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// PUT /api/items/:id/pricing
router.put("/:id/pricing", async (req, res) => {
  const { id } = req.params;
  const { pricing, variants } = req.body;

  if (!pricing || !variants) {
    return res.status(400).json({ message: "Pricing and variants required" });
  }

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Update pricing and variants
    item.pricing = { ...pricing, variants };
    await item.save();

    res.json({ message: "Pricing updated successfully", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items/:id/pricing
router.get("/:id/pricing", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item.pricing || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
