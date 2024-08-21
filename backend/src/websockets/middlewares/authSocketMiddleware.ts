// src/websockets/middlewares/authSocketMiddleware.ts

import { Socket } from 'socket.io';
import { tokenSchema } from '../schemas/authMiddlewareSchemas/tokenSchema';
import { verifyToken } from '../../utils/authTokens';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/user';

async function authSocketMiddleware(
    socket: Socket,
    next: (err?: Error) => void
) {
    try {
        console.log('Authenticating socket connection:', socket.id);
        // Validate the token using the schema
        const token = tokenSchema.parse(socket.handshake.query.token);

        // Verify the token
        const decoded = verifyToken(token);
        if (typeof decoded === 'object' && 'id' in decoded) {
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return next(new Error('User not found'));
            }
            if (!user.is_verified) {
                return next(new Error('User not verified'));
            }
            // Attach the user to the socket data
            socket.data.user = user;
            next();
        } else {
            next(new Error('Invalid token'));
        }
    } catch (err) {
        // Schema validation error
        if (err instanceof z.ZodError) {
            console.error('Token validation error:', err.errors);
            next(new Error('Invalid token format'));
        }
        // JWT verification error
        else if (err instanceof jwt.JsonWebTokenError) {
            console.error('JWT error:', err.message);
            next(new Error('Invalid or expired token'));
        }
        // General error
        else {
            console.error('Authentication error:', err);
            next(new Error('Authentication error'));
        }
    }
}

export default authSocketMiddleware;
