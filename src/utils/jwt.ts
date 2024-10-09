import jwt from 'jsonwebtoken';  

export const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): { userId: number } | null => {
    try {
      return jwt.verify(token, jwtSecret) as { userId: number };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  };