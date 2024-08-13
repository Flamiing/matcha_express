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
import ServiceError from '../errors/customErrors';

const registerHandler = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const { user } = await createAccount({ email, password });
		res.status(201).json({ message: 'Account created', user });
	} catch (err) {
		console.error(err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'Error creating account' });
		}
	}
};

const verifyEmailHandler = async (req: Request, res: Response) => {
	const { code } = req.params;

	try {
		const result = await verifyEmail(code);
		res.status(200).json({ message: 'Email verified successfully' });
	} catch (err) {
		console.error('Error verifying email:', err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'Error creating account' });
		}
	}
};

const loginHandler = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const { accessToken, refreshToken } = await loginUser({
			email,
			password,
		});
		res.status(200).json({ accessToken, refreshToken });
	} catch (err) {
		console.error('Error logging in:', err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'Error logging in' });
		}
	}
};

const refreshHandler = async (req: Request, res: Response) => {
	const { refreshToken } = req.body;

	try {
		const { accessToken, newRefreshToken } =
			await refreshAccessToken(refreshToken);
		res.status(200).json({ accessToken, refreshToken: newRefreshToken });
	} catch (err) {
		console.error('Error refreshing token:', err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'Error refreshing token' });
		}
	}
};

const logoutHandler = async (req: Request, res: Response) => {
	const { refreshToken } = req.body;

	try {
		const result = await logoutUser(refreshToken);
		res.status(200).json({ message: result.message });
	} catch (err) {
		console.error('Error logging out:', err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'Error logging out' });
		}
	}
};

const forgotPasswordHandler = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		const result = await generatePasswordResetToken(email);
		res.status(200).json({
			message: result.message,
		});
	} catch (err) {
		console.error('Error sending password reset link:', err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'An unexpected error occurred.' });
		}
	}
};

const resetPasswordHandler = async (req: Request, res: Response) => {
	const { email, token, password } = req.body;

	try {
		const result = await resetUserPassword(email, token, password);
		res.status(200).json({
			message: result.message,
		});
	} catch (err) {
		console.error('Error resetting password:', err);
		if (err instanceof ServiceError) {
			res.status(err.status).json({ message: err.message });
		} else {
			res.status(500).json({ message: 'An unexpected error occurred.' });
		}
	}
};

export {
	registerHandler,
	verifyEmailHandler,
	loginHandler,
	refreshHandler,
	logoutHandler,
	forgotPasswordHandler,
	resetPasswordHandler,
};
