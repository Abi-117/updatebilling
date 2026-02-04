import Item from "../models/Item.js";

/* ---------------- GET ALL ITEMS ---------------- */
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ status: "Active" }).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- CREATE ITEM ---------------- */
export const createItem = async (req, res) => {
  try {
    if (!req.body.sku) {
      req.body.sku = "SKU-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    }

    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Failed to create item", error: err.message });
  }
};

/* ---------------- UPDATE ITEM ---------------- */
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Failed to update item" });
  }
};

/* ---------------- DELETE ITEM ---------------- */
export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete item" });
  }
};

/* ---------------- SAVE / UPDATE PRICING ---------------- */
export const saveItemPricing = async (req, res) => {
  const { itemId } = req.params;
  const { pricing, variants } = req.body;

  if (!pricing || !variants) {
    return res.status(400).json({ message: "Pricing data missing" });
  }

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.pricing = {
      cost: Number(pricing.cost),
      selling: Number(pricing.selling),
      mrp: Number(pricing.mrp),
      variants: variants.map((v) => ({
        label: v.label,
        selling: Number(v.selling || pricing.selling),
        mrp: Number(v.mrp || pricing.mrp),
      })),
    };

    await item.save();
    res.json({ message: "Item pricing saved", pricing: item.pricing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET ITEM PRICING ---------------- */
export const getItemPricing = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).select("pricing");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item.pricing);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
