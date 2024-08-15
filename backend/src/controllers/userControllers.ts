// src/controllers/userControllers.ts

import { Request, Response } from 'express';
import { serviceErrorHandler } from '../errors/errorHandler';
import {
    createUser,
    deleteUser,
    getUserById,
    getAllUsers,
    updateUser,
} from '../services/userServices';

export const getAllUsersHandler = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const user = await getUserById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const updatedUser = await updateUser(Number(req.params.id), req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
        const deletedCount = await deleteUser(Number(req.params.id));
        if (deletedCount === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    } catch (err) {
        serviceErrorHandler(err, res);
    }
};
