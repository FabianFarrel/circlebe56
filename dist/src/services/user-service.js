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
class UserService {
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    fullName: true,
                    userName: true,
                    bio: true,
                    email: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    image: true,
                    background: true
                }
            });
            return user;
        });
    }
    ;
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    fullName: true,
                    userName: true,
                    bio: true,
                    email: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    image: true,
                    background: true
                }
            });
            return user;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: {
                    id
                }
            });
            if (!user) {
                throw new error_handle_1.CustomError("User not found", 404);
            }
            ;
            const updateUser = yield prisma.user.update({
                where: { id },
                data: {
                    fullName: data.fullName || user.fullName,
                    userName: data.userName || user.userName,
                    image: data.image || user.image,
                    background: data.background || user.background,
                    bio: data.bio || user.bio,
                },
                select: {
                    id: true,
                    fullName: true,
                    userName: true,
                    bio: true,
                    image: true,
                    background: true
                }
            });
            return {
                user: updateUser
            };
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                return null;
            }
            yield prisma.follow.deleteMany({
                where: {
                    OR: [
                        { followerId: id },
                        { followingId: id }
                    ]
                }
            });
            yield prisma.like.deleteMany({
                where: { userId: id }
            });
            yield prisma.reply.deleteMany({
                where: { authorId: id }
            });
            const posts = yield prisma.post.findMany({
                where: { authorId: id }
            });
            for (const post of posts) {
                yield prisma.reply.deleteMany({
                    where: { postId: post.id }
                });
                yield prisma.like.deleteMany({
                    where: { postId: post.id }
                });
                yield prisma.post.delete({
                    where: { id: post.id }
                });
            }
            return yield prisma.user.delete({
                where: { id },
            });
        });
    }
}
exports.default = new UserService();
