import Item from "../models/Item.js";

export const updatePricing = async (req, res) => {
  const { itemId } = req.params;
  const { pricing, variants } = req.body;

  if (!pricing?.cost || !pricing?.selling || !pricing?.mrp) {
    return res.status(400).json({ message: "Base pricing required" });
  }

  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.pricing = {
    ...pricing,
    variants,
  };

  await item.save();
  res.json(item.pricing);
};

export const getPricing = async (req, res) => {
  const item = await Item.findById(req.params.itemId).select("pricing");
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item.pricing || {});
};
