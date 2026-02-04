import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  vendor: { type: String },
  date: { type: Date, required: true },
  notes: { type: String },
});

export default mongoose.model("Expense", ExpenseSchema);
