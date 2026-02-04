import BillingEvent from "../models/BillingEvent.js";

export const getBillingEvents = async (req, res) => {
  const events = await BillingEvent.find().sort({ createdAt: -1 });
  res.json(events);
};

export const markEventPaid = async (req, res) => {
  const event = await BillingEvent.findByIdAndUpdate(
    req.params.id,
    { status: "Paid" },
    { new: true }
  );
  res.json(event);
};
