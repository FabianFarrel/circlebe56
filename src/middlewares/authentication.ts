import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "./error-handle";
import { RequestWithUser } from "../types/post";

export function authentication(req: RequestWithUser, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];

    // Check if the authorization header is provided and starts with "Bearer "
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return next(new CustomError("Authentication failed: No token provided", 401));
    }

    // Extract token from the authorization header
    const token = authorizationHeader.replace("Bearer ", "");

    if (!token) {
        return next(new CustomError("Authentication failed: Token is missing", 401));
    }

    // Ensure the JWT secret is available
    const secretKey = process.env.JWT_SECRET || '9[Qyn|(cQafW:S'; // Your fallback secret
    if (!secretKey) {
        console.error("JWT Secret not found.");
        return next(new CustomError("Internal server error: Secret key not configured", 500));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded token:", decoded);

        // Attach the decoded user to the request object
        req.user = decoded as jwt.JwtPayload;

        next();
    } catch (error) {
        console.error("JWT Error:", error);

        // Handle token expiration and other JWT errors
        if (error instanceof jwt.TokenExpiredError) {
            return next(new CustomError("Token has expired", 401));
        } else if (error instanceof jwt.JsonWebTokenError) {
            return next(new CustomError("Invalid token", 401));
        }

        // Handle generic authentication errors
        return next(new CustomError("Authentication failed", 401));
    }
}
