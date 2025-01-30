// backend/utils/mailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS // App password or email password
  }
});

// Function to send email
export const sendApplicationEmail = async (email, jobTitle, companyName) => {
  const subject = `Application Received for ${jobTitle}`;
  const message = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Application Confirmation</h2>
          <p style="font-size: 16px; color: #555;">Dear Applicant,</p>
          <p style="font-size: 16px; color: #555;">Thank you for applying for the <strong>${jobTitle}</strong> position at our company.</p>
          <p style="font-size: 16px; color: #555;">We have successfully received your application, and our team will review it soon. We will get back to you if your profile matches the job requirements.</p>
          <p style="font-size: 16px; color: #555;">Best regards,</p>
          <p style="font-size: 16px; color: #555;">The ${companyName} Team</p>
          <footer style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
            <p>&copy; 2025 ${companyName}. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: message
  });

  console.log(`Application email sent to ${email} for job: ${jobTitle}`);
};
