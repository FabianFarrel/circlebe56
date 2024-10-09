"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.followersResponseSchema = exports.followingResponseSchema = exports.userSchema = exports.followUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.followUserSchema = joi_1.default.object({
    userId: joi_1.default.number().integer().positive().required(),
});
exports.userSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    email: joi_1.default.string().email().required(),
    fullName: joi_1.default.string().optional(),
    userName: joi_1.default.string().optional(),
    image: joi_1.default.string().uri().optional(),
});
exports.followingResponseSchema = joi_1.default.array().items(exports.userSchema);
exports.followersResponseSchema = joi_1.default.array().items(exports.userSchema);
exports.schemas = {
    followUserSchema: exports.followUserSchema,
    followingResponseSchema: exports.followingResponseSchema,
    followersResponseSchema: exports.followersResponseSchema,
};
