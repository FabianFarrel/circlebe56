import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/jwt";
import { LoginDTO, RegisterDTO } from "../dto/auth-dto";
import { ForgotPasswordDTO, ResetPasswordDTO } from "../dto/forgot-dto";
import { CustomError } from "../middlewares/error-handle";
import { ResetPassword } from "../utils/fs-utils";

const prisma = new PrismaClient();

class AuthService {
    async register(
        data: RegisterDTO
    ): Promise<{ user: Omit<User, "password">, token: string }> {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(data.password, salt);
        const userName = data.email.split('@')[0];
        
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                userName
            }
        });

        const { password, ...userToSign } = user;
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return { 
            user: userToSign,
            token
        };
    }

    async login(
        data: LoginDTO
    ): Promise<{ user: Omit<User, "password">; token: string }> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ userName: data.userName }, { email: data.userName }, { fullName: data.userName }],
            },
        });

        if (!user) {
            throw new CustomError("Email/Username not found", 404);
        }

        const isValidPassword = await bcrypt.compare(data.password, user.password);
        if (!isValidPassword) {
            throw new CustomError("Password is wrong", 401);
        }

        const { password, ...userToSign } = user;
        const secretKey = process.env.JWT_SECRET as string;
        const token = jwt.sign(userToSign, secretKey);

        return {
            user: userToSign,
            token: token
        };
    }
}

export const forgotPassword = async (data: ForgotPasswordDTO) => {
    const { email } = data;

    // Basic email validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new CustomError("Invalid email format", 400);
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new CustomError("User not found", 404);
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "15m" });
        await ResetPassword(email, token);
    } catch (error) {
        console.error("Error during forgotPassword service:", error);
        // Provide a detailed error message in development mode
        if (process.env.NODE_ENV === 'development') {
            throw new CustomError(`Failed to process request: ${(error as Error).message}`, 500); // Expose full error in development
        } else {
            throw new CustomError("Error processing forgot password request", 500); // Generic error message in production
        }
    }
};



// Helper function to hash password
const hashPassword = async (password: string): Promise<string> => {
    const salt = 10;
    return await bcrypt.hash(password, salt);
};

// Reset Password Service
export const resetPassword = async (data: ResetPasswordDTO) => {
    const { token, newPassword } = data;

    // Validate token and catch errors
    let decoded;
    try {
        decoded = jwt.verify(token, jwtSecret) as { userId: number };
    } catch (error) {
        throw new CustomError("Invalid or expired token", 403);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
    });
};

export default new AuthService();
