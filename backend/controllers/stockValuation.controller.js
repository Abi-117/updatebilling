import Stock from "../models/Stock.js";
import Batch from "../models/Batch.js";
import Item from "../models/Item.js";

export const getStockValuation = async (req, res) => {
  try {
    const items = await Item.find();

    const stockLogs = await Stock.find().populate("item");
    const batches = await Batch.find().populate("item");

    const result = items.map(item => {
      const itemLogs = stockLogs.filter(l => l.item?._id.equals(item._id));
      const itemBatches = batches.filter(b => b.item?._id.equals(item._id));

      const qty = itemLogs.reduce(
        (t, l) => (l.type === "IN" ? t + l.quantity : t - l.quantity),
        0
      );

      const fifoValue = itemBatches.reduce(
        (t, b) => t + b.quantity * b.cost,
        0
      );

      const avgCost =
        itemBatches.length > 0
          ? fifoValue / itemBatches.reduce((t, b) => t + b.quantity, 0)
          : 0;

      return {
        itemId: item._id,
        itemName: item.name,
        quantity: qty,
        fifoValue: Math.round(fifoValue),
        avgCostValue: Math.round(avgCost),
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stock valuation failed" });
  }
};
