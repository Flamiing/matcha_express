import jwt, { VerifyOptions, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const signToken = (
    payload: string | object | Buffer,
    options?: SignOptions
) => {
    const defaultOptions: SignOptions = {
        // If not provided, default to 15 minutes expiration
        expiresIn: '15m',
    };
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        ...defaultOptions,
        ...options,
    });
};

export const verifyToken = (token: string, options?: VerifyOptions) => {
    return jwt.verify(token, process.env.JWT_SECRET!, options);
};

export const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};
