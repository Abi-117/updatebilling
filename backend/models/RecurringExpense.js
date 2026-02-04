import mongoose from "mongoose";

const RecurringExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ["Monthly", "Weekly", "Yearly"], default: "Monthly" },
  nextDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Paused"], default: "Active" },
  vendor: { type: String },
});

export default mongoose.model("RecurringExpense", RecurringExpenseSchema);
