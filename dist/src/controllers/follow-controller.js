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
const follow_service_1 = __importDefault(require("../services/follow-service"));
const follow_schemas_1 = require("../utils/schemas/follow-schemas");
class FollowController {
    toggleFollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = follow_schemas_1.followUserSchema.validate(req.params);
            if (error) {
                return res.status(400).json({ isFollowing: false, message: error.details[0].message });
            }
            const currentUserId = req.user.id;
            const followData = { userId: value.userId };
            const followStatus = yield follow_service_1.default.updateFollow(currentUserId, followData.userId);
            return res.json({ isFollowing: followStatus.isFollowing });
        });
    }
    getFollowing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserId = req.user.id;
            const following = yield follow_service_1.default.getFollowing(currentUserId);
            return res.json({ following });
        });
    }
    getFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUserId = req.user.id;
            const followers = yield follow_service_1.default.getFollowers(currentUserId);
            return res.json({ followers });
        });
    }
    checkFollowStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const currentUserId = req.user.id;
            const isFollowing = yield follow_service_1.default.checkFollowStatus(currentUserId, Number(userId));
            return res.json({ isFollowing });
        });
    }
}
exports.default = new FollowController();
