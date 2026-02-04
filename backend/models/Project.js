// models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  rate: { type: Number, required: true }, // rate per hour
  hours: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Completed", "On Hold"], default: "Active" },
  description: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
