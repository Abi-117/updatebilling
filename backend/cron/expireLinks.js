const PaymentLink = require("../models/PaymentLink");

module.exports = async () => {
  await PaymentLink.updateMany(
    { expiresAt: { $lt: new Date() }, status: "Pending" },
    { status: "Expired" }
  );
};
