import { PrismaClient } from "@prisma/client";
import { FollowDTO } from "../dto/follow-dto";

const prisma = new PrismaClient();

class FollowService {
    async updateFollow(currentUserId: number, targetUserId: number) {
        const follow = await prisma.follow.findFirst({
            where: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        });

        if (follow) {
            await prisma.follow.delete({
                where: { id: follow.id },
            });
            return { isFollowing: false };
        } else {
            await prisma.follow.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            });
            return { isFollowing: true };
        }
    }

    async getFollowing(userId: number) {
        const following = await prisma.follow.findMany({
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
    }

    async getFollowers(userId: number) {
        const followers = await prisma.follow.findMany({
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
    }

    async checkFollowStatus(currentUserId: number, targetUserId: number) {
        const follow = await prisma.follow.findFirst({
            where: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        });
        return follow !== null;
    }
}

export default new FollowService();
