import LowStockRule from "../models/LowStockRule.js";

/* ---------------- GET RULE ---------------- */
export const getLowStockRule = async (req, res) => {
  try {
    const { itemId } = req.params;

    const rule = await LowStockRule.findOne({ item: itemId });

    // If no rule exists, return defaults
    if (!rule) {
      return res.json({
        enabled: false,
        threshold: 10,
        notifyEmail: true,
        notifyInApp: true,
        frequency: "once",
      });
    }

    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch rule" });
  }
};

/* ---------------- CREATE / UPDATE RULE ---------------- */
export const saveLowStockRule = async (req, res) => {
  try {
    const { itemId } = req.params;
    const data = req.body;

    const rule = await LowStockRule.findOneAndUpdate(
      { item: itemId },
      {
        item: itemId,
        enabled: data.enabled,
        threshold: data.threshold,
        notifyEmail: data.notifyEmail,
        notifyInApp: data.notifyInApp,
        frequency: data.frequency,
      },
      { new: true, upsert: true }
    );

    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save rules" });
  }
};
