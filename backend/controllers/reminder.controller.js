import Reminder from "../models/Reminder.js";

export const getReminders = async (req, res) => {
  const reminders = await Reminder.find().sort({ date: 1 });
  res.json(reminders);
};

export const createReminder = async (req, res) => {
  const reminder = await Reminder.create(req.body);
  res.status(201).json(reminder);
};

export const updateReminderStatus = async (req, res) => {
  const reminder = await Reminder.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(reminder);
};

export const deleteReminder = async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
