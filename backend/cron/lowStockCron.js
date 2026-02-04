import cron from "node-cron";
import { checkLowStock } from "../controllers/lowStockController.js";

// Run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running low stock check...");
  await checkLowStock();
});
