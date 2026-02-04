import mongoose from "mongoose";

const GRNSchema = new mongoose.Schema({
  grnNo: { type: String, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  poNo: String,
  items: [
    {
      name: String,
      qty: Number,
      rate: Number
    }
  ],
  status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("GRN", GRNSchema);
