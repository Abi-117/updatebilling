import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  reason: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Stock", StockSchema);
