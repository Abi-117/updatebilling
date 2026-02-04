// models/ProductCodeEvent.js
import mongoose from "mongoose";

const ProductCodeEventSchema = new mongoose.Schema(
  {
    productId: mongoose.Schema.Types.ObjectId,

    eventType: {
      type: String,
      enum: [
        "CODE_CREATED",
        "CODE_UPDATED",
        "CODE_PRINTED",
        "CODE_DISABLED",
      ],
      required: true,
    },

    payload: { type: Object }, // snapshot of data

    createdBy: { type: String }, // user / system
  },
  { timestamps: true }
);

export default mongoose.model("ProductCodeEvent", ProductCodeEventSchema);
