"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.replySchema = joi_1.default.object({
    content: joi_1.default.string().min(5),
    image: joi_1.default.string(),
    postId: joi_1.default.number().integer(),
});
