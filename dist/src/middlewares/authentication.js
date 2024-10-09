"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = authentication;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handle_1 = require("./error-handle");
function authentication(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    // Check if the authorization header is provided and starts with "Bearer "
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return next(new error_handle_1.CustomError("Authentication failed: No token provided", 401));
    }
    // Extract token from the authorization header
    const token = authorizationHeader.replace("Bearer ", "");
    if (!token) {
        return next(new error_handle_1.CustomError("Authentication failed: Token is missing", 401));
    }
    // Ensure the JWT secret is available
    const secretKey = process.env.JWT_SECRET || '9[Qyn|(cQafW:S'; // Your fallback secret
    if (!secretKey) {
        console.error("JWT Secret not found.");
        return next(new error_handle_1.CustomError("Internal server error: Secret key not configured", 500));
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("Decoded token:", decoded);
        // Attach the decoded user to the request object
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("JWT Error:", error);
        // Handle token expiration and other JWT errors
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new error_handle_1.CustomError("Token has expired", 401));
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new error_handle_1.CustomError("Invalid token", 401));
        }
        // Handle generic authentication errors
        return next(new error_handle_1.CustomError("Authentication failed", 401));
    }
}
