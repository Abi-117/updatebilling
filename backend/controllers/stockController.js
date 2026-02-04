import Stock from "../models/Stock.js";

export const getStockLogs = async (req, res) => {
  try {
    const logs = await Stock.find().populate("item").sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addStockLog = async (req, res) => {
  try {
    const newLog = await Stock.create(req.body);
    const log = await newLog.populate("item");
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
