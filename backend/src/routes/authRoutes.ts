import { Router } from 'express';
import {
	registerHandler,
	verifyEmailHandler,
	loginHandler,
	refreshHandler,
	logoutHandler,
	forgotPasswordHandler,
	resetPasswordHandler,
} from '../controllers/authControllers';

const authRoutes = Router();

// prefix: /api/auth
authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.post('/password/forgot', forgotPasswordHandler);
authRoutes.post('/password/reset', resetPasswordHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);

export default authRoutes;
