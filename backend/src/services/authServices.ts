// src/services/authServices.ts

import db from '../config/databaseConnection';
import bcrypt from 'bcrypt';
import {
    getPasswordResetTemplate,
    getVerifyEmailTemplate,
    getReportPasswordChangedTemplate,
} from '../utils/emailTemplates';
import {
    emailPasswordSchema,
    emailSchema,
    newPasswordSchema,
    codeValidationSchema,
    tokenValidationSchema,
} from '../schemas/authSchemas';
import UserModel from '../models/user';
import UserTokenModel from '../models/userToken';
import { signToken, verifyToken, generateToken } from '../utils/authTokens';
import { parseDuration } from '../utils/dateParsing';
import { sendMail } from '../utils/sendMail';
import { ServiceError } from '../errors/customErrors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { parse } from 'path';

dotenv.config();

export const createAccount = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    // Validate email and password format
    const { error } = emailPasswordSchema.validate({ email, password });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Search for existing user with the same email
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
        throw new ServiceError('User already exists', 409);
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await UserModel.create({ email, password: hashedPassword });
    // Generate a verification token
    const token = generateToken();
    await UserTokenModel.create({
        user_id: user.id,
        token,
        type: 'verification',
        expires_at: new Date(
            Date.now() +
                parseDuration(process.env.VERIFICATION_TOKEN_EXPIRY || '1d')
        ),
    });
    // Send verification email
    const url = `${process.env.FRONTEND_URL}/email/verify/${token}`;
    await sendMail({
        to: email,
        ...getVerifyEmailTemplate(url),
    });
    // Return the user object without the password
    const userWithoutPassword = { ...user, password: undefined };
    return { user: userWithoutPassword };
};

export const verifyEmail = async (code: string) => {
    // Validate the verification code
    const { error } = codeValidationSchema.validate({ code });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Find the token in the database
    const token = await UserTokenModel.findByToken(code);
    if (!token) {
        throw new ServiceError('Invalid verification code', 400);
    }
    // Check if the token has expired
    if (token.expires_at < new Date()) {
        throw new ServiceError('Verification code expired', 400);
    }
    // Check if the token is a verification token
    if (token.type !== 'verification') {
        throw new ServiceError('Invalid verification code', 400);
    }
    // Find the user associated with the
    const user = await UserModel.findById(token.user_id);
    if (!user) {
        throw new ServiceError('User not found', 404);
    }
    if (user.is_verified) {
        throw new ServiceError('Email already verified', 400);
    }
    // Update the user to set email_verified_at and is_verified to true
    await UserModel.update(user.id, {
        email_verified_at: new Date(),
        is_verified: true,
    });
    // Delete the verificaiton token
    await UserTokenModel.delete(token.id);

    return { message: 'Email verified successfully' };
};

export const loginUser = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    // Validate email and password format
    const { error } = emailPasswordSchema.validate({ email, password });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Find the user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
        throw new ServiceError('Invalid email or password', 400);
    }
    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new ServiceError('Invalid email or password', 400);
    }
    // Create access token (Short lived token)
    const accessToken = signToken(
        { id: user.id, email: user.email },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    // Create refresh token
    const refreshToken = generateToken();
    // Refresh token expiry duration or set a default value of 7 days
    await UserTokenModel.create({
        user_id: user.id,
        token: refreshToken,
        type: 'refresh',
        expires_at: new Date(
            Date.now() + parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')
        ),
    });
    // Return the access token and refresh token
    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
    // Validate the refresh token
    const { error } = tokenValidationSchema.validate({ token: refreshToken });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Find the refresh token in the database
    const token = await UserTokenModel.findByToken(refreshToken);
    if (!token) {
        throw new ServiceError('Invalid refresh token', 401);
    }
    if (token.expires_at < new Date()) {
        throw new ServiceError('Refresh token expired', 401);
    }
    if (token.type !== 'refresh') {
        throw new ServiceError('Invalid refresh token', 401);
    }
    // Find the user associated with the token
    const user = await UserModel.findById(token.user_id);
    if (!user) {
        throw new ServiceError('User not found', 404);
    }
    // Create a new access token
    const accessToken = signToken(
        { id: user.id, email: user.email },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    // Generate a new refresh token
    const newRefreshToken = generateToken();
    await UserTokenModel.update(token.id, {
        token: newRefreshToken,
        expires_at: new Date(
            Date.now() + parseDuration(process.env.REFRESH_TOKEN_EXPIRY || '7d')
        ),
    });
    // Return the new access token and refresh token
    return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken: string) => {
    // Validate the refresh token
    const { error } = tokenValidationSchema.validate({ token: refreshToken });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Find the refresh token in the database
    const token = await UserTokenModel.findByToken(refreshToken);
    if (!token) {
        throw new ServiceError('Invalid refresh token', 401);
    }
    if (token.type !== 'refresh') {
        throw new ServiceError('Invalid refresh token', 401);
    }
    console.log(`Revoking refresh token for user_id: ${token.user_id}`);
    // Delete the refresh token (Frontend removes access/refresh tokens from local storage)
    await UserTokenModel.delete(token.id);
    return { message: 'Logged out' };
};

export const generatePasswordResetToken = async (email: string) => {
    // Validate email format
    const { error } = emailSchema.validate({ email });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Find the user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
        throw new ServiceError('User not found', 404);
    }
    // Generate a password reset token
    const token = generateToken();
    await UserTokenModel.create({
        user_id: user.id,
        token,
        type: 'password_reset',
        expires_at: new Date(
            Date.now() +
                parseDuration(process.env.PASSWORD_RESET_TOKEN_EXPIRY || '1d')
        ),
    });
    // Send password reset email
    const url = `${process.env.FRONTEND_URL}/password/reset/${token}`;
    await sendMail({
        to: email,
        ...getPasswordResetTemplate(url),
    });

    return { message: 'Password reset link sent' };
};

export const resetUserPassword = async (
    email: string,
    token: string,
    password: string
) => {
    // Validate email, token, and password format
    const { error } = newPasswordSchema.validate({ password });
    if (error) {
        throw new ServiceError(error.message, 400);
    }
    // Find the token in the database
    const tokenRecord = await UserTokenModel.findByToken(token);
    if (!tokenRecord) {
        throw new ServiceError('Invalid or expired token', 400);
    }
    if (tokenRecord.expires_at < new Date()) {
        throw new ServiceError('Invalid or expired token', 400);
    }
    if (tokenRecord.type !== 'password_reset') {
        throw new ServiceError('Invalid token', 400);
    }
    // Find the user associated with the token
    const user = await UserModel.findById(tokenRecord.user_id);
    if (!user) {
        throw new ServiceError('User not found', 404);
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.update(user.id, { password: hashedPassword });
    // Delete the password reset token
    await UserTokenModel.delete(tokenRecord.id);
    // Email the User reporting the password change
    await sendMail({
        to: email,
        ...getReportPasswordChangedTemplate(),
    });

    return { message: 'Password reset successful' };
};
