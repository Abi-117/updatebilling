// backend/services/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendInvoiceEmail = async ({ to, cc, bcc, subject, body, pdfBuffer, filename }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      cc,
      bcc,
      subject,
      text: body,
      attachments: [
        {
          filename: filename || "invoice.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};
