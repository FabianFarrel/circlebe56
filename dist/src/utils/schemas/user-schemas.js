"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateUserSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(3).max(100),
    userName: joi_1.default.string().min(3).max(100),
    bio: joi_1.default.string().min(3).max(100).allow(null, ''),
    image: joi_1.default.string().optional().allow(null, ''),
    background: joi_1.default.string().optional().allow(null, ''),
});
