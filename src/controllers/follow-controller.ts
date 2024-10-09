import { RequestWithUser } from "../types/post";
import { Response } from "express";
import followService from "../services/follow-service";
import { followUserSchema } from "../utils/schemas/follow-schemas"; 
import { FollowDTO, FollowResponseDTO, FollowingListResponseDTO, FollowersListResponseDTO } from "../dto/follow-dto"; 

class FollowController {
    async toggleFollow(req: RequestWithUser, res: Response<FollowResponseDTO>) {
        const { error, value } = followUserSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ isFollowing: false, message: error.details[0].message }); 
        }

        const currentUserId = req.user.id;
        const followData: FollowDTO = { userId: value.userId };

        const followStatus = await followService.updateFollow(currentUserId, followData.userId);
        return res.json({ isFollowing: followStatus.isFollowing }); 
    }

    async getFollowing(req: RequestWithUser, res: Response<FollowingListResponseDTO>) {
        const currentUserId = req.user.id;
        const following = await followService.getFollowing(currentUserId);
        return res.json({ following }); 
    }

    async getFollowers(req: RequestWithUser, res: Response<FollowersListResponseDTO>) {
        const currentUserId = req.user.id;
        const followers = await followService.getFollowers(currentUserId);
        return res.json({ followers }); 
    }

    async checkFollowStatus(req: RequestWithUser, res: Response<FollowResponseDTO>) {
        const { userId } = req.params; 
        const currentUserId = req.user.id; 
        const isFollowing = await followService.checkFollowStatus(currentUserId, Number(userId));
        return res.json({ isFollowing }); 
    }
}

export default new FollowController();
