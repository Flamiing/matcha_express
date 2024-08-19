import { Router } from 'express';
import {
    registerHandler,
    verifyEmailHandler,
    loginHandler,
    refreshHandler,
    logoutHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    getMeHandler,
} from '../controllers/authControllers';
import authMiddleware from '../middlewares/authMiddleware';

const authRoutes = Router();

// prefix: /api/auth
authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.post('/password/forgot', forgotPasswordHandler);
authRoutes.post('/password/reset', resetPasswordHandler);
authRoutes.post('/refresh', refreshHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);
authRoutes.get('/me', authMiddleware, getMeHandler);

export default authRoutes;
