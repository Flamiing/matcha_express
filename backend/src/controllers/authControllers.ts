// src/controllers/authControllers.ts

import {
    createAccount,
    verifyEmail,
    loginUser,
    refreshAccessToken,
    logoutUser,
    generatePasswordResetToken,
    resetUserPassword,
} from '../services/authServices';
import { Request, Response } from 'express';
import { parseDuration } from '../utils/dateParsing';
import { serviceErrorHandler } from '../errors/errorHandler';

export async function registerHandler(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const { user } = await createAccount({ email, password });
        res.status(201).json({ message: 'Account created', user });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function verifyEmailHandler(req: Request, res: Response) {
    const { code } = req.params;

    try {
        const result = await verifyEmail(code);
        res.status(200).json({ message: result.message });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function loginHandler(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken, user } = await loginUser({
            email,
            password,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d'),
            sameSite: 'strict',
        });
        res.status(200).json({ accessToken, user });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function refreshHandler(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const { accessToken, newRefreshToken, user } =
            await refreshAccessToken(refreshToken);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d'),
            sameSite: 'strict',
        });
        res.status(200).json({ accessToken, user });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function logoutHandler(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const result = await logoutUser(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json({ message: result.message });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
    const { email } = req.body;

    try {
        const result = await generatePasswordResetToken(email);
        res.status(200).json({
            message: result.message,
        });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function resetPasswordHandler(req: Request, res: Response) {
    const { email, token, password } = req.body;

    try {
        const result = await resetUserPassword(email, token, password);
        res.status(200).json({
            message: result.message,
        });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}

export async function getMeHandler(req: Request, res: Response) {
    // User object is attached to the request object by the auth middleware
    try {
        res.status(200).json({ user: req.user });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
}
