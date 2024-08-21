// src/routes/userRoutes.ts

import { Router, Request, Response } from 'express';
import {
    getAllUsersHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
} from '../controllers/userControllers';
import adminMiddleware from '../middlewares/adminMiddleware';

const userRoutes = Router();

// prefix: /api/users
userRoutes.get('/', adminMiddleware, getAllUsersHandler);
userRoutes.post('/', adminMiddleware, createUserHandler);
userRoutes.get('/:id', adminMiddleware, getUserByIdHandler);
userRoutes.put('/:id', adminMiddleware, updateUserHandler);
userRoutes.delete('/:id', adminMiddleware, deleteUserHandler);

export default userRoutes;
