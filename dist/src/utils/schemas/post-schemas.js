"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.postSchema = joi_1.default.object({
    content: joi_1.default.string().min(5),
    image: joi_1.default.string().optional().allow(null, ''),
    authorId: joi_1.default.number().integer()
});
