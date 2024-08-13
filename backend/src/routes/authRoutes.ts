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

// prefix: /auth
authRoutes.post('/register', registerHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.post('/password/forgot', forgotPasswordHandler);
authRoutes.post('/password/reset', resetPasswordHandler);

export default authRoutes;
