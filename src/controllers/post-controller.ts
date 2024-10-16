import { Request, Response } from "express";
import { postSchema } from "../utils/schemas/post-schemas";
import postService from "../services/post-service";
import { RequestWithUser } from "../types/post";
import { PrismaClient } from "@prisma/client";
import cloudinaryService from "../services/cloudinary.service";
import { CustomError } from "../middlewares/error-handle";
import { formatTimeAgo } from "../middlewares/time";

const prisma = new PrismaClient();

class postController {
    async getAllPost(req: Request, res: Response) {
        try {
            
        const posts = await prisma.post.findMany({
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
        })
        const postWithTimeAgo = posts.map((post) => ({
            ...post,
            timeAgo: formatTimeAgo(new Date(post.createdAt))
        }))
        res.json(postWithTimeAgo)
        } catch (error) {
            console.log(error);
            res.status(500).json({message: (error as unknown as Error).message})
        }
    }

    async getPostByAuthor(req: RequestWithUser, res: Response) {
        const authorId = Number(req.params.authorId)
        const post = await postService.getAllPosts(authorId); 
        const postWithTimeAgo = post.map((post) => ({
            ...post,
            timeAgo: formatTimeAgo(new Date(post.createdAt))
        }))
        res.json(postWithTimeAgo)
    }

    async getPostByUserId(req: RequestWithUser, res: Response) {
        const userId = Number(req.params.userId);
        const post = await postService.getAllPostsByAuthor(userId);
        const postWithTimeAgo = post.map((post) => ({
            ...post,
            timeAgo: formatTimeAgo(new Date(post.createdAt))
        }))
        res.json(postWithTimeAgo)
    }

    async getPostById(req: RequestWithUser, res: Response) {
        const { postId } = req.params;
        const post = await postService.getPostById(parseInt(postId));
        if (!post) {
            return new CustomError("Post not found", 404);
        }
        const postWithTimeAgo = {
            ...post,
            timeAgo: formatTimeAgo(new Date(post.createdAt))
        };
        res.json({data: postWithTimeAgo})
    }

    async createPost(req: RequestWithUser, res: Response) {
        try {
            let imageUrl = null;
            
            if (req.file) {
                const image = await cloudinaryService.upload(req.file);
                imageUrl = image.secure_url;
            }

            const body = { ...req.body, image: imageUrl || undefined };  
    
            const value = await postSchema.validateAsync(body);
    
            const createPost = await postService.createPost(value, req.user.id);
            
            res.json({ success: true, data: createPost });
        } catch (error) {

            if (error instanceof Error) {
                console.error("Error creating post:", error.message);
                res.status(500).json({ success: false, message: error.message, stack: error.stack });
            } else {
                
                console.error("An unexpected error occurred:", error);
                res.status(500).json({ success: false, message: "An unexpected error occurred." });
            }
        }
    }
    
    

    async updatePost(req: RequestWithUser, res: Response) {
        const id = Number(req.params.id);
        const value = await postSchema.validateAsync(req.body);
        const updatePost = await postService.updatePost({ ...value, id });
        res.json(updatePost)
    }

    async deletePost(req: RequestWithUser, res: Response) {
        const id = Number(req.params.id);
        const deletePost = await postService.deletePost(id);
        res.json(deletePost);
    }
}

export default new postController()