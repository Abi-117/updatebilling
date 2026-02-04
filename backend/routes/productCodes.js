import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bwipjs from "bwip-js";
import QRCode from "qrcode";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// --------------------------
// In-memory mock DB (replace with MongoDB for production)
let productCodesDB = {}; // key = productId

// --------------------------
// GET product codes
// --------------------------
router.get("/:productId", (req, res) => {
  const { productId } = req.params;
  const data = productCodesDB[productId] || null;
  res.json(data);
});

// --------------------------
// GENERATE barcode & QR images (preview only)
// --------------------------
router.post("/generate", async (req, res) => {
  const { barcode, qr } = req.body;

  if (!barcode || !qr) {
    return res.status(400).json({ error: "Barcode & QR required" });
  }

  try {
    // --- Barcode PNG ---
    const barcodeFileName = `barcode-${Date.now()}.png`;
    const barcodePath = path.join(uploadsDir, barcodeFileName);
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: barcode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });
    fs.writeFileSync(barcodePath, barcodeBuffer);

    // --- QR Code PNG ---
    const qrFileName = `qr-${Date.now()}.png`;
    const qrPath = path.join(uploadsDir, qrFileName);
    await QRCode.toFile(qrPath, qr, { width: 150 });

    res.json({
      barcodeImage: `/uploads/${barcodeFileName}`,
      qrImage: `/uploads/${qrFileName}`,
    });
  } catch (err) {
    console.error("Error generating codes:", err);
    res.status(500).json({ error: "Failed to generate codes" });
  }
});

// --------------------------
// SAVE product codes to DB (mock, production: MongoDB)
// --------------------------
router.post("/save", async (req, res) => {
  const { productId, sku, barcode, qr } = req.body;

  if (!productId || !sku || !barcode || !qr)
    return res.status(400).json({ error: "All fields are required" });

  // Save to in-memory DB
  productCodesDB[productId] = {
    sku,
    barcode: {
      value: barcode,
      image: `/uploads/barcode-${Date.now()}.png`, // replace with actual saved file path
    },
    qr: {
      value: qr,
      image: `/uploads/qr-${Date.now()}.png`, // replace with actual saved file path
    },
  };

  res.json(productCodesDB[productId]);
});

export default router;
