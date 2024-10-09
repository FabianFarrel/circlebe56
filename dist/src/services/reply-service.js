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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const error_handle_1 = require("../middlewares/error-handle");
const prisma = new client_1.PrismaClient();
class replyService {
    getReplyByPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reply.findMany({
                where: { postId },
                include: {
                    author: {
                        select: {
                            fullName: true,
                            userName: true,
                            image: true
                        }
                    }
                }, orderBy: {
                    createdAt: 'desc'
                }
            });
        });
    }
    ;
    createReply(data, authorId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newReply = yield prisma.reply.create({
                data: {
                    content: data.content,
                    image: data.image || null,
                    postId,
                    authorId
                }
            });
            const replyCount = yield prisma.reply.count({
                where: { postId }
            });
            yield prisma.post.update({
                where: { id: postId },
                data: { repliesCount: replyCount }
            });
            return newReply;
        });
    }
    ;
    updateReply(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield prisma.reply.findUnique({
                where: {
                    id: data.id,
                }
            });
            const update = {};
            if (reply && data.content) {
                reply.content = data.content;
            }
            if (reply && data.image) {
                reply.image = data.image;
            }
            return yield prisma.reply.update({
                data: update,
                where: { id: data.id },
            });
        });
    }
    deleteReply(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield prisma.reply.findUnique({
                where: { id },
            });
            if (!reply) {
                throw new error_handle_1.CustomError("Reply not found", 404);
            }
            yield prisma.reply.delete({
                where: { id }
            });
            const replyCount = yield prisma.reply.count({
                where: { postId: reply.postId }
            });
            yield prisma.post.update({
                where: { id: reply.postId },
                data: { repliesCount: replyCount }
            });
            return reply;
        });
    }
}
;
exports.default = new replyService();
