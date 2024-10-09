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
class FollowService {
    updateFollow(currentUserId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const follow = yield prisma.follow.findFirst({
                where: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            });
            if (follow) {
                yield prisma.follow.delete({
                    where: { id: follow.id },
                });
                return { isFollowing: false };
            }
            else {
                yield prisma.follow.create({
                    data: {
                        followerId: currentUserId,
                        followingId: targetUserId,
                    },
                });
                return { isFollowing: true };
            }
        });
    }
    getFollowing(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const following = yield prisma.follow.findMany({
                where: { followerId: userId },
                include: {
                    following: {
                        select: {
                            id: true,
                            userName: true,
                            fullName: true,
                            image: true,
                        },
                    },
                },
            });
            return following.map(follow => ({
                userId: follow.following.id,
                userName: follow.following.userName,
                fullName: follow.following.fullName,
                profileImageUrl: follow.following.image,
            }));
        });
    }
    getFollowers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followers = yield prisma.follow.findMany({
                where: { followingId: userId },
                include: {
                    follower: {
                        select: {
                            id: true,
                            userName: true,
                            fullName: true,
                            image: true,
                        },
                    },
                },
            });
            return followers.map(follow => ({
                userId: follow.follower.id,
                userName: follow.follower.userName,
                fullName: follow.follower.fullName,
                profileImageUrl: follow.follower.image,
            }));
        });
    }
    checkFollowStatus(currentUserId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const follow = yield prisma.follow.findFirst({
                where: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            });
            return follow !== null;
        });
    }
}
exports.default = new FollowService();
