import { Request, Response } from 'express';
import { searchService } from '../services/search-service';
import { RequestWithUser } from '../types/post';

export const searchController = async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id;
    const { query } = req.query as { query?: string }; 

    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }

    try {
        const users = await searchService(query, userId);
        return res.json(users);
    } catch (error: unknown) {

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "An unexpected error occurred." });
        }
    }
};
