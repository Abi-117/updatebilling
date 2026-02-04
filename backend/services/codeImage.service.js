import bwipjs from "bwip-js";
import QRCode from "qrcode";

/* ---------------- BARCODE ---------------- */
export const generateBarcodeImage = async (
  value,
  format = "code128"
) => {
  const png = await bwipjs.toBuffer({
    bcid: format,       // Barcode type
    text: value,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
  });

  return `data:image/png;base64,${png.toString("base64")}`;
};

/* ---------------- QR CODE ---------------- */
export const generateQrImage = async (value) => {
  const qr = await QRCode.toDataURL(value, {
    width: 300,
    margin: 2,
  });

  return qr; // already base64
};
