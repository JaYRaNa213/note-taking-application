import nodemailer from "nodemailer";
import env from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ use Gmail service
  auth: {
    user: env.SMTP_USER, // your Gmail address
    pass: env.SMTP_PASS, // app password (NOT your Gmail password)
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_USER, // Gmail requires same as auth user
      to,
      subject: "Your OTP for Notes App",
      text: `Your OTP: ${otp} (valid for 10 minutes)`,
    });
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}
