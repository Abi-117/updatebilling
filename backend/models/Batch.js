import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  batchNo: { type: String, required: true },
  expiry: { type: Date, required: true },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Batch", BatchSchema);
