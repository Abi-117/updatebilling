import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    entity: { type: String, enum: ["Invoice", "Subscription"] },
    ref: String,
    customer: String,
    amount: Number,
    date: Date,
    status: {
      type: String,
      enum: ["Scheduled", "Sent", "Overdue"],
      default: "Scheduled",
    },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
