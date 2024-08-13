// src/services/authServices.ts

import db from '../config/database';
import bcrypt from 'bcrypt';
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from '../utils/emailTemplates';
import {
  emailPasswordSchema,
  emailSchema,
  newPasswordSchema,
  codeValidationSchema,
  tokenValidationSchema,
} from '../schemas/authSchemas';
import UserModel from '../models/User';
import UserTokenModel from '../models/UserToken';
import { signToken, verifyToken, generateToken } from '../utils/auth';
import { sendMail } from '../utils/sendMail';
import ServiceError from '../errors/customErrors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createAccount = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error } = emailPasswordSchema.validate({ email, password });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new ServiceError('User already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, password: hashedPassword });

  const token = generateToken();
  await UserTokenModel.create({
    user_id: user.id,
    token,
    type: 'verification',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const url = `${process.env.FRONTEND_URL}/email/verify/${token}`;
  await sendMail({
    to: email,
    ...getVerifyEmailTemplate(url),
  });

  const userWithoutPassword = { ...user, password: undefined };
  return { user: userWithoutPassword };
};

export const verifyEmail = async (code: string) => {
  const { error } = codeValidationSchema.validate({ code });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const token = await db('user_tokens').where({ token: code }).first();
  if (!token) {
    throw new ServiceError('Invalid verification code', 400);
  }
  if (token.expires_at < new Date()) {
    throw new ServiceError('Verification code expired', 400);
  }

  const user = await db('users').where({ id: token.user_id }).first();
  if (!user) {
    throw new ServiceError('User not found', 404);
  }
  if (user.email_verified_at) {
    throw new ServiceError('Email already verified', 400);
  }
  if (token.type !== 'verification') {
    throw new ServiceError('Invalid verification code', 400);
  }

  await db('users').where({ id: user.id }).update({
    email_verified_at: new Date(),
    is_verified: true,
  });
  await db('user_tokens').where({ id: token.id }).delete();
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error } = emailPasswordSchema.validate({ email, password });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const user = await db('users').where({ email }).first();
  if (!user) {
    throw new ServiceError('Invalid email or password', 400);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new ServiceError('Invalid email or password', 400);
  }

  // Create access token
  const accessToken = signToken(
    { id: user.id, email: user.email },
    { expiresIn: '15m' }
  );

  // Create refresh token
  const refreshToken = await bcrypt.hash(accessToken, 10);
  await db('user_tokens').insert({
    user_id: user.id,
    token: refreshToken,
    type: 'refresh',
    created_at: new Date(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { error } = tokenValidationSchema.validate({ token: refreshToken });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const token = await db('user_tokens').where({ token: refreshToken }).first();
  if (!token) {
    throw new ServiceError('Invalid refresh token', 401);
  }
  if (token.expires_at < new Date()) {
    throw new ServiceError('Refresh token expired', 401);
  }
  if (token.type !== 'refresh') {
    throw new ServiceError('Invalid refresh token', 401);
  }

  const user = await db('users').where({ id: token.user_id }).first();
  if (!user) {
    throw new ServiceError('User not found', 404);
  }
  // Check refresh token against stored token
  const valid = await bcrypt.compare(refreshToken, token.token);

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );

  const newRefreshToken = await bcrypt.hash(accessToken, 10);
  await db('user_tokens')
    .where({ id: token.id })
    .update({
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

  return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken: string) => {
  const { error } = tokenValidationSchema.validate({ token: refreshToken });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const token = await db('user_tokens').where({ token: refreshToken }).first();
  if (!token) {
    throw new ServiceError('Invalid refresh token', 401);
  }
  if (token.type !== 'refresh') {
    throw new ServiceError('Invalid refresh token', 401);
  }
  console.log(`Revoking refresh token for user_id: ${token.user_id}`);

  await db('user_tokens').where({ id: token.id }).delete();
  return { message: 'Logged out' };
};

export const generatePasswordResetToken = async (email: string) => {
  const { error } = emailSchema.validate({ email });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const user = await db('users').where({ email }).first();
  if (!user) {
    throw new ServiceError('User not found', 404);
  }

  const token = await bcrypt.hash(`${email}${Date.now()}`, 10);
  await db('user_tokens').insert({
    user_id: user.id,
    token,
    type: 'password_reset',
    created_at: new Date(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

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
  const { error } = newPasswordSchema.validate({ password });
  if (error) {
    throw new ServiceError(error.message, 400);
  }

  const tokenRecord = await db('user_tokens').where({ token }).first();
  if (!tokenRecord) {
    throw new ServiceError('Invalid or expired token', 400);
  }
  if (tokenRecord.expires_at < new Date()) {
    throw new ServiceError('Invalid or expired token', 400);
  }
  if (tokenRecord.type !== 'password_reset') {
    throw new ServiceError('Invalid token', 400);
  }

  const user = await db('users').where({ id: tokenRecord.user_id }).first();
  if (!user) {
    throw new ServiceError('User not found', 404);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db('users').where({ id: user.id }).update({ password: hashedPassword });
  await db('user_tokens').where({ id: tokenRecord.id }).delete();

  return { message: 'Password reset successful' };
};
