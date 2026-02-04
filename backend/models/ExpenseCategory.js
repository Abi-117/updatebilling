import mongoose from "mongoose";

const ExpenseCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    budget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("ExpenseCategory", ExpenseCategorySchema);
