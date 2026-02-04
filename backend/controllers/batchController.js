import Batch from "../models/Batch.js";

// GET all batches
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate("item").sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch batches" });
  }
};

// POST create batch
export const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    const populatedBatch = await batch.populate("item");
    res.status(201).json(populatedBatch);
  } catch (err) {
    res.status(500).json({ error: "Failed to create batch" });
  }
};

// PUT update batch
export const updateBatch = async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("item");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update batch" });
  }
};

// DELETE batch
export const deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Batch deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete batch" });
  }
};
