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
exports.resetPassword = exports.forgotPassword = void 0;
const auth_service_1 = __importDefault(require("../services/auth-service"));
const auth_service_2 = require("../services/auth-service");
const auth_schemas_1 = require("../utils/schemas/auth-schemas");
const joi_1 = require("joi");
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield auth_schemas_1.registerSchema.validateAsync(req.body);
                const user = yield auth_service_1.default.register(value);
                res.status(201).json(user);
            }
            catch (error) {
                console.error("Registration Error:", error);
                if (error instanceof joi_1.ValidationError) {
                    res.status(400).json({ message: error.details[0].message });
                }
                else {
                    res.status(500).json({ message: "Registration failed due to an unexpected error." });
                }
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield auth_schemas_1.loginSchema.validateAsync(req.body);
                const user = yield auth_service_1.default.login(value);
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Login Error:", error);
                if (error instanceof joi_1.ValidationError) {
                    res.status(400).json({ message: error.details[0].message });
                }
                else {
                    res.status(500).json({ message: "Login failed due to an unexpected error." });
                }
            }
        });
    }
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user; // Cast request to include user
                if (!user) {
                    return res.status(401).json({ message: "User not authenticated." });
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Check Auth Error:", error);
                res.status(500).json({ message: "Internal Server Error." });
            }
        });
    }
}
// Forgot Password Route
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // Optionally, validate the request body here
    // Validate email format or other constraints if necessary
    try {
        yield (0, auth_service_2.forgotPassword)(data);
        return res.status(200).json({ message: "Reset password link sent to email" });
    }
    catch (error) {
        console.error("Error during forgot password:", error);
        return res.status(500).json({ error: "Error sending email" });
    }
});
exports.forgotPassword = forgotPassword;
// Reset Password Route
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // Optionally, validate the request body here
    // Validate token and password format if necessary
    try {
        yield (0, auth_service_2.resetPassword)(data);
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error during reset password:", error);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
});
exports.resetPassword = resetPassword;
exports.default = new AuthController();
