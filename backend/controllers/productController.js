import Product from "../models/Product.js";

/* ---------------- Save Pricing ---------------- */
export const savePricing = async (req, res) => {
  try {
    const { productId } = req.params;
    const { pricing, variants } = req.body;

    if (!productId) return res.status(400).json({ error: "Product ID missing" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.pricing = {
      cost: pricing.cost,
      selling: pricing.selling,
      mrp: pricing.mrp,
      variants: variants || [],
    };

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save pricing" });
  }
};

/* ---------------- Save Tax ---------------- */
export const saveTax = async (req, res) => {
  try {
    const { productId } = req.params;
    const { price, taxPercent, taxInclusive, cgst, sgst, igst, taxAmount, totalPrice } = req.body;

    if (!productId) return res.status(400).json({ error: "Product ID missing" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.tax = { price, taxPercent, taxInclusive, cgst, sgst, igst, taxAmount, totalPrice };
    await product.save();

    res.json({ success: true, tax: product.tax });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save tax" });
  }
};
