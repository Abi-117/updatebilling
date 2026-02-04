import express from "express";
import bwipjs from "bwip-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/barcode/generate
router.post("/generate", async (req, res) => {
  try {
    const { text } = req.body; // e.g., "123456789012"
    if (!text) return res.status(400).json({ error: "Text is required" });

    // Create uploads folder if it doesn't exist
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const fileName = `barcode-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);

    // Generate barcode PNG
    const png = await bwipjs.toBuffer({
      bcid: "code128",       // Barcode type
      text: text,            // Text to encode
      scale: 3,              // 3x scaling factor
      height: 10,            // Bar height, in mm
      includetext: true,     // Show human-readable text
      textxalign: "center",
    });

    // Save to /uploads
    fs.writeFileSync(filePath, png);

    // Return URL for frontend
    const imageUrl = `/uploads/${fileName}`;
    res.json({ barcodeImage: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate barcode" });
  }
});

export default router;
