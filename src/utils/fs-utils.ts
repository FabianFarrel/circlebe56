import nodemailer from "nodemailer";
import { CustomError } from "../middlewares/error-handle";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT || "2525"),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const ResetPassword = async (email: string, token: string) => {
  const resetLink = `http://localhost:5173/reset/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password",
    text: `You requested a password reset. Click the link below to reset your password: ${resetLink}`,
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset password email sent:", info.response);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    // If you need to expose the error details in development mode, add this check
    if (process.env.NODE_ENV === 'development') {
      throw new CustomError(`Failed to send email: ${(error as Error).message}`, 500); // Expose full error in development
    } else {
      throw new CustomError("Failed to send reset password email", 500); // Generic error message in production
    }
  }
};
