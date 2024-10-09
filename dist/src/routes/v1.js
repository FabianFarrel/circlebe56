"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerV1 = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importStar(require("../controllers/auth-controller"));
const post_controller_1 = __importDefault(require("../controllers/post-controller"));
const reply_controller_1 = __importDefault(require("../controllers/reply-controller"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const authentication_1 = require("../middlewares/authentication");
const catch_1 = require("../utils/catch");
const uploadImage_1 = __importDefault(require("../middlewares/uploadImage"));
const like_controller_1 = __importDefault(require("../controllers/like-controller"));
const follow_controller_1 = __importDefault(require("../controllers/follow-controller"));
const search_controller_1 = require("../controllers/search-controller");
exports.routerV1 = express_1.default.Router();
exports.routerV1.get("/", (req, res) => {
    res.send("Hello");
});
exports.routerV1.post("/logout", (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logout successful" });
});
/** Authentication Routes **/
exports.routerV1.post("/auth/register", (0, catch_1.catchAsync)(auth_controller_1.default.register));
exports.routerV1.post("/auth/login", (0, catch_1.catchAsync)(auth_controller_1.default.login));
exports.routerV1.get("/auth/check", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(auth_controller_1.default.check));
/** Forgot and Reset Password **/
exports.routerV1.post('/auth/forgot', (0, catch_1.catchAsync)(auth_controller_1.forgotPassword)); // Corrected path for forgot password
exports.routerV1.post('/auth/reset', (0, catch_1.catchAsync)(auth_controller_1.resetPassword)); // Corrected path for reset password
// Update user data
exports.routerV1.put("/user", (0, catch_1.catchAsync)(authentication_1.authentication), uploadImage_1.default.fields([{ name: 'image', maxCount: 1 }, { name: 'background', maxCount: 1 }]), (0, catch_1.catchAsync)(user_controller_1.default.update));
// Get user data
exports.routerV1.get("/getUser", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(user_controller_1.default.getUser));
exports.routerV1.get("/getUserById/:userId", (0, catch_1.catchAsync)(user_controller_1.default.getUserById.bind(user_controller_1.default)));
exports.routerV1.get("/getAllUser", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(user_controller_1.default.getAllUser));
// Create posts and replies
exports.routerV1.get("/getAllPost", (0, catch_1.catchAsync)(post_controller_1.default.getAllPost));
exports.routerV1.post("/post", (0, catch_1.catchAsync)(authentication_1.authentication), uploadImage_1.default.single('image'), (0, catch_1.catchAsync)(post_controller_1.default.createPost));
exports.routerV1.post("/post/:postId/reply", (0, catch_1.catchAsync)(authentication_1.authentication), uploadImage_1.default.single('image'), (0, catch_1.catchAsync)(reply_controller_1.default.createReply));
// Get post status by ID
exports.routerV1.get("/post/status/:postId", (0, catch_1.catchAsync)(post_controller_1.default.getPostById.bind(post_controller_1.default)));
// Get replies for a post
exports.routerV1.get("/post/:postId/reply", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(reply_controller_1.default.getReplyByPost));
// Get all posts by author ID
exports.routerV1.get("/post/:authorId", (0, catch_1.catchAsync)(post_controller_1.default.getPostByAuthor));
exports.routerV1.get("/profile/post/:userId", (0, catch_1.catchAsync)(post_controller_1.default.getPostByUserId));
// Like a post
exports.routerV1.post("/post/:postId/like", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(like_controller_1.default.likePost));
// Get all likes from a post
exports.routerV1.get("/post/:postId/like", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(like_controller_1.default.getLikes));
// Follow-related routes
exports.routerV1.get("/follow/:userId", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(follow_controller_1.default.checkFollowStatus));
exports.routerV1.patch('/follow/:userId', (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(follow_controller_1.default.toggleFollow));
// Get following and followers
exports.routerV1.get("/follow/following", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(follow_controller_1.default.getFollowing));
exports.routerV1.get("/follow/followers", (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(follow_controller_1.default.getFollowers));
// Route for searching posts
exports.routerV1.get('/search', (0, catch_1.catchAsync)(authentication_1.authentication), (0, catch_1.catchAsync)(search_controller_1.searchController));
