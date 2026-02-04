import Estimate from "../models/Estimate.js";

export const updateEstimateStatuses = async () => {
  const estimates = await Estimate.find();
  const today = new Date();

  for (const est of estimates) {
    let newStatus = est.status;

    if (
      est.status === "Pending" &&
      new Date(est.date).setHours(0, 0, 0, 0) <
        today.setHours(0, 0, 0, 0)
    ) {
      newStatus = "Expired";
    }

    if (newStatus !== est.status) {
      est.status = newStatus;
      await est.save();
    }
  }
};
