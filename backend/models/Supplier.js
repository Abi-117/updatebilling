import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
}, { timestamps: true });

export default mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
