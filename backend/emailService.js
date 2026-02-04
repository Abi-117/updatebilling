import nodemailer from "nodemailer";

// Replace with your SMTP or service
const transporter = nodemailer.createTransport({
  service: "gmail", // or use SendGrid SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use App Password for Gmail
  },
});

export const sendInvoiceEmail = async ({ to, cc, bcc, subject, body, pdfBuffer, invoiceNo }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      cc: cc || undefined,
      bcc: bcc || undefined,
      subject,
      html: body,
      attachments: [
        {
          filename: `Invoice-${invoiceNo}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};
