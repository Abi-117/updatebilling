import mongoose from "mongoose";

const customerDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    phone: String,
    gstin: String,
    pan: String,
    billingAddress: String,

    creditLimit: {
      type: Number,
      default: 0,
    },

    openingOutstanding: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomerDetails", customerDetailsSchema);
