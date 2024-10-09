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
const post_schemas_1 = require("../utils/schemas/post-schemas");
const post_service_1 = __importDefault(require("../services/post-service"));
const client_1 = require("@prisma/client");
const cloudinary_service_1 = __importDefault(require("../services/cloudinary.service"));
const error_handle_1 = require("../middlewares/error-handle");
const time_1 = require("../middlewares/time");
const prisma = new client_1.PrismaClient();
class postController {
    getAllPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield prisma.post.findMany({
                include: {
                    author: {
                        select: {
                            fullName: true,
                            userName: true,
                            image: true
                        }
                    },
                },
                orderBy: { createdAt: 'desc' }
            });
            const postWithTimeAgo = posts.map((post) => (Object.assign(Object.assign({}, post), { timeAgo: (0, time_1.formatTimeAgo)(new Date(post.createdAt)) })));
            res.json(postWithTimeAgo);
        });
    }
    getPostByAuthor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorId = Number(req.params.authorId);
            const post = yield post_service_1.default.getAllPosts(authorId);
            const postWithTimeAgo = post.map((post) => (Object.assign(Object.assign({}, post), { timeAgo: (0, time_1.formatTimeAgo)(new Date(post.createdAt)) })));
            res.json(postWithTimeAgo);
        });
    }
    getPostByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.params.userId);
            const post = yield post_service_1.default.getAllPostsByAuthor(userId);
            const postWithTimeAgo = post.map((post) => (Object.assign(Object.assign({}, post), { timeAgo: (0, time_1.formatTimeAgo)(new Date(post.createdAt)) })));
            res.json(postWithTimeAgo);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const post = yield post_service_1.default.getPostById(parseInt(postId));
            if (!post) {
                return new error_handle_1.CustomError("Post not found", 404);
            }
            const postWithTimeAgo = Object.assign(Object.assign({}, post), { timeAgo: (0, time_1.formatTimeAgo)(new Date(post.createdAt)) });
            res.json({ data: postWithTimeAgo });
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl = null;
                if (req.file) {
                    const image = yield cloudinary_service_1.default.upload(req.file);
                    imageUrl = image.secure_url;
                }
                const body = Object.assign(Object.assign({}, req.body), { image: imageUrl || undefined });
                const value = yield post_schemas_1.postSchema.validateAsync(body);
                const createPost = yield post_service_1.default.createPost(value, req.user.id);
                res.json({ success: true, data: createPost });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error creating post:", error.message);
                    res.status(500).json({ success: false, message: error.message, stack: error.stack });
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    res.status(500).json({ success: false, message: "An unexpected error occurred." });
                }
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const value = yield post_schemas_1.postSchema.validateAsync(req.body);
            const updatePost = yield post_service_1.default.updatePost(Object.assign(Object.assign({}, value), { id }));
            res.json(updatePost);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const deletePost = yield post_service_1.default.deletePost(id);
            res.json(deletePost);
        });
    }
}
exports.default = new postController();
