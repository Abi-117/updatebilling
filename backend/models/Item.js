import mongoose from "mongoose";

/* ---------------- LOCATION ---------------- */
const LocationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  openingStock: { type: Number, default: 0 },
});

/* ---------------- VARIANT ---------------- */
const VariantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    selling: { type: Number, required: true },
    mrp: { type: Number, required: true },
  },
  { _id: false }
);

/* ---------------- PRICING ---------------- */
const PricingSchema = new mongoose.Schema(
  {
    cost: { type: Number, required: true },
    selling: { type: Number, required: true },
    mrp: { type: Number, required: true },
    variants: { type: [VariantSchema], default: [] },
  },
  { _id: false }
);

/* ---------------- INVENTORY ---------------- */
const InventorySchema = new mongoose.Schema(
  {
    trackStock: { type: Boolean, default: true },
    openingStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    enableBatch: { type: Boolean, default: false },
    enableExpiry: { type: Boolean, default: false },
    stockValuation: {
      type: String,
      enum: ["FIFO", "LIFO", "AVERAGE"],
      default: "FIFO",
    },
    locations: { type: [LocationSchema], default: [] },
  },
  { _id: false }
);

/* ---------------- LOW STOCK RULES ---------------- */
const LowStockRulesSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    threshold: { type: Number, default: 10 },
    notifyEmail: { type: Boolean, default: true },
    notifyInApp: { type: Boolean, default: true },
    frequency: { type: String, enum: ["once", "daily", "weekly"], default: "once" },
  },
  { _id: false }
);

/* ---------------- ITEM ---------------- */
const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Product", "Service"], required: true },
    hsn: { type: String, required: true },
    tax: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    sku: { type: String, unique: true, sparse: true },

    pricing: { type: PricingSchema, required: true },
    inventory: { type: InventorySchema, required: true },
    lowStockRules: { type: LowStockRulesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("Item", ItemSchema);
