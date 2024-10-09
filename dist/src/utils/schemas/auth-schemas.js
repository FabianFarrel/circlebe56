"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(5).max(100).required(),
    email: joi_1.default.string().email(),
    password: joi_1.default.string().min(6)
});
exports.loginSchema = joi_1.default.object({
    userName: joi_1.default.alternatives().try(joi_1.default.string().email().messages({
        'string.email': "Please write your email correctly!"
    }), joi_1.default.string().min(3).max(30).alphanum().messages({
        'string.base': "Username must be a string",
        'string.empty': "Username cannot be empty",
        'string.min': "Username must be at least 3 characters long",
        'string.max': "Username must be at most 30 characters long",
        'string.alphanum': "Username can only contain alphanumeric characters"
    })).required(),
    password: joi_1.default.string().min(4).required().messages({
        'string.base': "Password must be a string",
        'string.empty': "Password cannot be empty",
        'string.min': "Password must be at least 4 characters long"
    }),
});
