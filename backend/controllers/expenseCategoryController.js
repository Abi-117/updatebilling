import ExpenseCategory from "../models/ExpenseCategory.js";

/* ---------------- GET CATEGORIES ---------------- */
export const getCategories = async (req, res) => {
  try {
    res.json(await ExpenseCategory.find());
  } catch (err) {
    res.status(500).json({ message: "Failed to load categories" });
  }
};

/* ---------------- CREATE CATEGORY ---------------- */
export const createCategory = async (req, res) => {
  try {
    const category = await ExpenseCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to create category" });
  }
};

/* ---------------- UPDATE CATEGORY ---------------- */
export const updateCategory = async (req, res) => {
  try {
    const updated = await ExpenseCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update category" });
  }
};
