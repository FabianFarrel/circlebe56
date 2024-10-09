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
const user_service_1 = __importDefault(require("../services/user-service"));
const { PrismaClient } = require('@prisma/client');
const user_schemas_1 = require("../utils/schemas/user-schemas");
const cloudinary_service_1 = __importDefault(require("../services/cloudinary.service"));
const error_handle_1 = require("../middlewares/error-handle");
const user_service_2 = __importDefault(require("../services/user-service"));
const prisma = new PrismaClient();
class userController {
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const user = yield prisma.user.findMany({
                where: { id: { not: userId } },
                select: {
                    id: true,
                    fullName: true,
                    userName: true,
                    bio: true,
                    email: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    image: true
                }
            });
            return res.json(user);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const user = yield user_service_1.default.getUser(userId);
            const following = user === null || user === void 0 ? void 0 : user._count.followers;
            const followers = user === null || user === void 0 ? void 0 : user._count.following;
            res.json(Object.assign(Object.assign({}, user), { following,
                followers }));
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const user = yield user_service_1.default.getUserById(parseInt(userId));
            const following = user === null || user === void 0 ? void 0 : user._count.followers;
            const followers = user === null || user === void 0 ? void 0 : user._count.following;
            res.json(Object.assign(Object.assign({}, user), { following,
                followers }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                let imageUrl;
                let backgroundUrl;
                const files = req.files;
                if (files === null || files === void 0 ? void 0 : files.image) {
                    console.log("Image file: ", files.image[0]); // Log the file info
                    const image = yield cloudinary_service_1.default.upload(files.image[0]);
                    imageUrl = image.secure_url;
                }
                if (files === null || files === void 0 ? void 0 : files.background) {
                    console.log("Background file: ", files.background[0]); // Log the file info
                    const background = yield cloudinary_service_1.default.upload(files.background[0]);
                    backgroundUrl = background.secure_url;
                }
                const body = Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), { bio: req.body.bio }), (imageUrl && { image: imageUrl })), (backgroundUrl && { background: backgroundUrl }));
                console.log("Request body: ", req.body);
                console.log("Request body after parsing: ", body);
                const value = yield user_schemas_1.updateUserSchema.validateAsync(body);
                const user = yield user_service_1.default.updateUser(userId, value);
                res.json(user);
            }
            catch (error) {
                console.error("Error updating user: ", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const deletePost = yield user_service_2.default.deleteUser(id);
            if (!deletePost) {
                throw new error_handle_1.CustomError("Post not found", 404);
            }
            res.json(deletePost);
        });
    }
}
exports.default = new userController();
