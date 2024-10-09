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
class LikeController {
    getLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = parseInt(req.params.postId);
            const userId = req.user.id;
            const post = yield prisma.post.findUnique({
                where: { id: postId },
                include: {
                    like: {
                        where: { userId },
                    }
                }
            });
            if (!post) {
                return new error_handle_1.CustomError("Post not found", 404);
            }
            const isLiked = post.like && post.like.length > 0;
            const likesCount = post.like ? post.like.length : 0;
            res.json({ isLiked, likesCount });
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = parseInt(req.params.postId);
            const userId = req.user.id;
            const checkLike = yield prisma.like.findUnique({
                where: { userId_postId: { postId, userId } }
            });
            if (checkLike) {
                yield prisma.like.delete({
                    where: { id: checkLike.id },
                });
                yield prisma.post.update({
                    where: { id: postId },
                    data: { likesCount: { decrement: 1 } },
                });
                return res.json({ message: 'Like removed' });
            }
            else {
                yield prisma.like.create({
                    data: { postId, userId },
                });
                yield prisma.post.update({
                    where: { id: postId },
                    data: { likesCount: { increment: 1 } },
                });
                return res.json({ message: 'Like added' });
            }
        });
    }
}
exports.default = new LikeController();
