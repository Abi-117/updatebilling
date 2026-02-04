// controllers/timesheetController.js
import Timesheet from "../models/Timesheet.js";
import Project from "../models/Project.js";

// GET all timesheets
export const getTimesheets = async (req, res) => {
  const timesheets = await Timesheet.find().populate("project");
  res.json(timesheets);
};

// CREATE timesheet
export const createTimesheet = async (req, res) => {
  const { project, hours, billable, task, rate } = req.body;
  const amount = billable ? hours * rate : 0;

  const ts = new Timesheet({ ...req.body, amount });
  const saved = await ts.save();

  // Update project total hours
  await Project.findByIdAndUpdate(project, { $inc: { hours } });

  res.status(201).json(saved);
};

// UPDATE timesheet
export const updateTimesheet = async (req, res) => {
  const old = await Timesheet.findById(req.params.id);
  const updated = await Timesheet.findByIdAndUpdate(req.params.id, req.body, { new: true });

  // Adjust project hours if hours changed
  if (req.body.hours && req.body.hours !== old.hours) {
    const diff = req.body.hours - old.hours;
    await Project.findByIdAndUpdate(updated.project, { $inc: { hours: diff } });
  }

  res.json(updated);
};

// DELETE timesheet
export const deleteTimesheet = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Timesheet.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    res.json({ message: "Timesheet deleted successfully" });
  } catch (err) {
    console.error("Delete timesheet error", err);
    res.status(500).json({ message: "Server error" });
  }
};
