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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const error_handle_1 = require("../middlewares/error-handle");
const fs_utils_1 = require("../utils/fs-utils");
const prisma = new client_1.PrismaClient();
class AuthService {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = 10;
            const hashedPassword = yield bcrypt_1.default.hash(data.password, salt);
            const userName = data.email.split('@')[0];
            const user = yield prisma.user.create({
                data: Object.assign(Object.assign({}, data), { password: hashedPassword, userName })
            });
            const { password } = user, userToSign = __rest(user, ["password"]);
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return {
                user: userToSign,
                token
            };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
                where: {
                    OR: [{ userName: data.userName }, { email: data.userName }, { fullName: data.userName }],
                },
            });
            if (!user) {
                throw new error_handle_1.CustomError("Email/Username not found", 404);
            }
            const isValidPassword = yield bcrypt_1.default.compare(data.password, user.password);
            if (!isValidPassword) {
                throw new error_handle_1.CustomError("Password is wrong", 401);
            }
            const { password } = user, userToSign = __rest(user, ["password"]);
            const secretKey = process.env.JWT_SECRET;
            const token = jsonwebtoken_1.default.sign(userToSign, secretKey);
            return {
                user: userToSign,
                token: token
            };
        });
    }
}
const forgotPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = data;
    // Basic email validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new error_handle_1.CustomError("Invalid email format", 400);
    }
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new error_handle_1.CustomError("User not found", 404);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwt_1.jwtSecret, { expiresIn: "15m" });
        yield (0, fs_utils_1.ResetPassword)(email, token);
    }
    catch (error) {
        console.error("Error during forgotPassword service:", error);
        // Provide a detailed error message in development mode
        if (process.env.NODE_ENV === 'development') {
            throw new error_handle_1.CustomError(`Failed to process request: ${error.message}`, 500); // Expose full error in development
        }
        else {
            throw new error_handle_1.CustomError("Error processing forgot password request", 500); // Generic error message in production
        }
    }
});
exports.forgotPassword = forgotPassword;
// Helper function to hash password
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = 10;
    return yield bcrypt_1.default.hash(password, salt);
});
// Reset Password Service
const resetPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = data;
    // Validate token and catch errors
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtSecret);
    }
    catch (error) {
        throw new error_handle_1.CustomError("Invalid or expired token", 403);
    }
    // Hash new password
    const hashedPassword = yield hashPassword(newPassword);
    yield prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
    });
});
exports.resetPassword = resetPassword;
exports.default = new AuthService();
