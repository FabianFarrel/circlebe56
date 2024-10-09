import { Request, Response } from "express";
import authService from "../services/auth-service";
import { forgotPassword as forgotPasswordService, resetPassword as resetPasswordService } from "../services/auth-service";
import { loginSchema, registerSchema } from "../utils/schemas/auth-schemas";
import { ValidationError } from "joi";
import { ForgotPasswordDTO, ResetPasswordDTO } from "../dto/forgot-dto";

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const value = await registerSchema.validateAsync(req.body);
            const user = await authService.register(value);
            res.status(201).json(user);
        } catch (error) {
            console.error("Registration Error:", error);
            if (error instanceof ValidationError) {
                res.status(400).json({ message: error.details[0].message });
            } else {
                res.status(500).json({ message: "Registration failed due to an unexpected error." });
            }
        }
    }

    async login(req: Request, res: Response) {
        try {
            const value = await loginSchema.validateAsync(req.body);
            const user = await authService.login(value);
            res.status(200).json(user);
        } catch (error) {
            console.error("Login Error:", error);
            if (error instanceof ValidationError) {
                res.status(400).json({ message: error.details[0].message });
            } else {
                res.status(500).json({ message: "Login failed due to an unexpected error." });
            }
        }
    }

    async check(req: Request, res: Response) {
        try {
            const user = (req as any).user; // Cast request to include user
            if (!user) {
                return res.status(401).json({ message: "User not authenticated." });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Check Auth Error:", error);
            res.status(500).json({ message: "Internal Server Error." });
        }
    }
}

// Forgot Password Route
export const forgotPassword = async (req: Request, res: Response) => {
    const data: ForgotPasswordDTO = req.body;

    // Optionally, validate the request body here
    // Validate email format or other constraints if necessary

    try {
        await forgotPasswordService(data);  
        return res.status(200).json({ message: "Reset password link sent to email" });
    } catch (error: any) {
        console.error("Error during forgot password:", error);
        return res.status(500).json({ error: "Error sending email" });
    }
};

// Reset Password Route
export const resetPassword = async (req: Request, res: Response) => {
    const data: ResetPasswordDTO = req.body;

    // Optionally, validate the request body here
    // Validate token and password format if necessary

    try {
        await resetPasswordService(data);  
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.error("Error during reset password:", error);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

export default new AuthController();
