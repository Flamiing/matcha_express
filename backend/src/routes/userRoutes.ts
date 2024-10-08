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
userRoutes.get('/test/', getAllUsersHandler); // REMOVE ME
userRoutes.post('/test/', createUserHandler); // REMOVE ME
userRoutes.get('/test/:id', getUserByIdHandler); // REMOVE ME
userRoutes.patch('/test/:id', updateUserHandler); // REMOVE ME
userRoutes.delete('/test/:id', deleteUserHandler); // REMOVE ME
userRoutes.get('/', adminMiddleware, getAllUsersHandler);
userRoutes.post('/', adminMiddleware, createUserHandler);
userRoutes.get('/:id', adminMiddleware, getUserByIdHandler);
userRoutes.patch('/:id', adminMiddleware, updateUserHandler);
userRoutes.delete('/:id', adminMiddleware, deleteUserHandler);

export default userRoutes;
