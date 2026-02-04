// controllers/projectController.js
import Project from "../models/Project.js";

// GET all projects
export const getProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};

// CREATE project
export const createProject = async (req, res) => {
  const project = new Project(req.body);
  const saved = await project.save();
  res.status(201).json(saved);
};

// UPDATE project
export const updateProject = async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE project
export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
};
