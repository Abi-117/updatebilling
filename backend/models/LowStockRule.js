import mongoose from "mongoose";

const LowStockRuleSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      unique: true, // one rule per item
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    threshold: {
      type: Number,
      default: 10,
    },

    notifyEmail: {
      type: Boolean,
      default: true,
    },

    notifyInApp: {
      type: Boolean,
      default: true,
    },

    frequency: {
      type: String,
      enum: ["once", "daily", "weekly"],
      default: "once",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LowStockRule", LowStockRuleSchema);
