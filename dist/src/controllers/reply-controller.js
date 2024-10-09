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
const reply_service_1 = __importDefault(require("../services/reply-service"));
const reply_schemas_1 = require("../utils/schemas/reply-schemas");
const cloudinary_service_1 = __importDefault(require("../services/cloudinary.service"));
const time_1 = require("../middlewares/time");
class replyController {
    getReplyByPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = Number(req.params.postId);
            const reply = yield reply_service_1.default.getReplyByPost(postId);
            const postWithTimeAgo = reply.map((reply) => (Object.assign(Object.assign({}, reply), { timeAgo: (0, time_1.formatTimeAgo)(new Date(reply.createdAt)) })));
            res.json(postWithTimeAgo);
        });
    }
    createReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = Number(req.params.postId);
            let imageUrl;
            if (req.file) {
                const image = yield cloudinary_service_1.default.upload(req.file);
                imageUrl = image.secure_url;
            }
            const body = Object.assign(Object.assign({}, req.body), (imageUrl && { image: imageUrl }));
            const value = yield reply_schemas_1.replySchema.validateAsync(body);
            const createReply = yield reply_service_1.default.createReply(value, req.user.id, postId);
            res.json(createReply);
        });
    }
    updateReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const value = yield reply_schemas_1.replySchema.validateAsync(req.body);
            const updateReply = yield reply_service_1.default.updateReply(Object.assign(Object.assign({}, value), { id }));
            res.json(updateReply);
        });
    }
    deleteReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const deletedReply = yield reply_service_1.default.deleteReply(id);
            res.json(deletedReply);
        });
    }
}
exports.default = new replyController();
