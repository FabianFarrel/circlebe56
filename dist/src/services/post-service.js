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
const prisma = new client_1.PrismaClient();
class postService {
    getAllPosts(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findMany({
                where: { authorId },
                include: {
                    reply: true,
                    like: true,
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            userName: true,
                            bio: true,
                            createdAt: true,
                            email: true,
                            followers: true,
                            following: true,
                            updatedAt: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            const postsWithReplyCount = post.map((post) => {
                return Object.assign(Object.assign({}, post), { repliesCount: post.reply.length });
            });
            return postsWithReplyCount;
        });
    }
    ;
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.findUnique({
                where: {
                    id: postId
                },
                include: {
                    reply: true,
                    author: {
                        select: {
                            fullName: true,
                            userName: true,
                            image: true
                        }
                    }
                }
            });
        });
    }
    ;
    getAllPostsByAuthor(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findMany({
                where: { authorId },
                include: {
                    reply: true,
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            userName: true,
                            bio: true,
                            createdAt: true,
                            email: true,
                            followers: true,
                            following: true,
                            updatedAt: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            const postsWithReplyCount = post.map((post) => {
                return Object.assign(Object.assign({}, post), { repliesCount: post.reply.length });
            });
            return postsWithReplyCount;
        });
    }
    ;
    createPost(data, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.create({
                data: Object.assign(Object.assign({}, data), { authorId })
            });
        });
    }
    ;
    updatePost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
                where: {
                    id: data.id,
                }
            });
            const update = {};
            if (post && data.content) {
                post.content = data.content;
            }
            if (post && data.image) {
                post.image = data.image;
            }
            return yield prisma.post.update({
                data: update,
                where: { id: data.id },
            });
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
                where: { id },
            });
            if (!post) {
                return null;
            }
            yield prisma.post.deleteMany({
                where: { authorId: id }
            });
            yield prisma.reply.deleteMany({
                where: {
                    AND: [
                        { authorId: id },
                        { postId: id }
                    ]
                }
            });
            yield prisma.like.deleteMany({
                where: {
                    post: {
                        authorId: id
                    }
                }
            });
            yield prisma.follow.deleteMany({
                where: {
                    OR: [
                        { followerId: id },
                        { followingId: id }
                    ]
                }
            });
            return yield prisma.post.delete({
                where: { id },
            });
        });
    }
}
;
exports.default = new postService();
