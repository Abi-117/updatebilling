// models/Subscription.model.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
    },
    startDate: { type: Date, required: true },
  },
  { timestamps: true, strict: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
