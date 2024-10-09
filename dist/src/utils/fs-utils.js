"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const error_handle_1 = require("../middlewares/error-handle");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT || "2525"),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});
const ResetPassword = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
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
        const info = yield transporter.sendMail(mailOptions);
        console.log("Reset password email sent:", info.response);
    }
    catch (error) {
        console.error("Error sending reset password email:", error);
        // If you need to expose the error details in development mode, add this check
        if (process.env.NODE_ENV === 'development') {
            throw new error_handle_1.CustomError(`Failed to send email: ${error.message}`, 500); // Expose full error in development
        }
        else {
            throw new error_handle_1.CustomError("Failed to send reset password email", 500); // Generic error message in production
        }
    }
});
exports.ResetPassword = ResetPassword;
