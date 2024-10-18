import jwt, { JwtPayload } from 'jsonwebtoken';

export const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): number | null => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded.userId; // Return userId directly
  } catch (error) {
    // Improved error handling
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed: ' + (error as Error).message);
    }
  }
};
