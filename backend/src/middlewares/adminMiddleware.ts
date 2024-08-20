import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/authTokens';
import userModel from '../models/UserModel';

async function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Verify the token using the JWT secret
        const decoded = verifyToken(token);

        if (typeof decoded === 'object' && 'id' in decoded) {
            const user = await userModel.getById(decoded.id);
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Unauthorized: User not found' });
            }
            if (!user.is_admin) {
                return res
                    .status(401)
                    .json({ message: 'Unauthorized: User not an admin' });
            }
            // Attach the user object to the request object
            req.user = user;
            return next();
        } else {
            return res
                .status(401)
                .json({ message: 'Unauthorized: Invalid token' });
        }
    } catch (err) {
        // Handle token verification errors
        if (err instanceof TokenExpiredError) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: Token expired' });
        }
        return res
            .status(401)
            .json({ message: 'Unauthorized: Invalid or expired token' });
    }
}

export default adminMiddleware;
