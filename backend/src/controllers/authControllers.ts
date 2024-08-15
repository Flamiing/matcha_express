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
import { serviceErrorHandler } from '../errors/errorHandler';

export const registerHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { user } = await createAccount({ email, password });
        res.status(201).json({ message: 'Account created', user });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        const result = await verifyEmail(code);
        res.status(200).json({ message: result.message });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const loginHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await loginUser({
            email,
            password,
        });
        res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const refreshHandler = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
        const { accessToken, newRefreshToken } =
            await refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const logoutHandler = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
        const result = await logoutUser(refreshToken);
        res.status(200).json({ message: result.message });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const result = await generatePasswordResetToken(email);
        res.status(200).json({
            message: result.message,
        });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
    const { email, token, password } = req.body;

    try {
        const result = await resetUserPassword(email, token, password);
        res.status(200).json({
            message: result.message,
        });
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};
