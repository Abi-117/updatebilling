import RecurringExpense from "../models/RecurringExpense.js";

export const getRecurringExpenses = async (req, res) => {
  const expenses = await RecurringExpense.find();
  res.json(expenses);
};

export const createRecurringExpense = async (req, res) => {
  const exp = new RecurringExpense(req.body);
  const saved = await exp.save();
  res.status(201).json(saved);
};

export const updateRecurringExpense = async (req, res) => {
  const updated = await RecurringExpense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteRecurringExpense = async (req, res) => {
  await RecurringExpense.findByIdAndDelete(req.params.id);
  res.json({ message: "Recurring expense deleted" });
};
