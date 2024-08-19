import userModel from '../models/UserModel';
import UserTokenModel from '../models/UserTokenModel';

interface UserRequest {
    username?: string;
    email: string;
    password: string;
    is_verified?: boolean;
    is_admin?: boolean;
    email_verified_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

export const getAllUsers = async () => {
    return await userModel.findAll();
};

export const createUser = async (data: UserRequest) => {
    return await userModel.create(data);
};

export const getUserById = async (id: number) => {
    return await userModel.findById(id);
};

export const updateUser = async (id: number, data: UserRequest) => {
    return await userModel.update(id, data);
};

export const deleteUser = async (id: number) => {
    return await userModel.delete(id);
};
