import mongoose from "mongoose";

const estimateItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const EstimateSchema = new mongoose.Schema(
  {
    /* ---------- ESTIMATE NUMBER ---------- */
    estimateNo: {
      type: String,
      required: true,
      unique: true, // ✅ ONLY UNIQUE FIELD
      index: true,
    },

    /* ---------- CUSTOMER (DUPLICATE ALLOWED) ---------- */
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      default: "",
      trim: true,
    },

    gstin: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Draft", "Sent", "Invoiced", "Expired"],
      default: "Draft",
    },

    /* ---------- ITEMS ---------- */
    items: {
      type: [estimateItemSchema],
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "At least one item is required",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ avoid save crash
    },
  },
  { timestamps: true }
);

/* ---------- AUTO-GENERATE ESTIMATE NO (SAFE) ---------- */
EstimateSchema.pre("validate", async function (next) {
  if (!this.isNew || this.estimateNo) return next();

  try {
    const counter = await mongoose.connection.collection("counters").findOneAndUpdate(
      { _id: "estimateNo" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    const seq = counter.value.seq.toString().padStart(5, "0");
    this.estimateNo = `EST${seq}`;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Estimate", EstimateSchema);
