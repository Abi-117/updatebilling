import mongoose from "mongoose";

const TimesheetSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  task: String,
  hours: { type: Number, required: true },
  billable: { type: Boolean, default: true },
  rate: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  source: { type: String, default: "Manual" },
  invoiced: { type: Boolean, default: false }, // mark invoiced
});

export default mongoose.models.Timesheet ||
  mongoose.model("Timesheet", TimesheetSchema);
