import UserModel from '../models/user';
import UserTokenModel from '../models/userToken';


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
    return await UserModel.findAll();
}

export const createUser = async (data: UserRequest) => {
    return await UserModel.create(data);
}

export const getUserById = async (id: number) => {
    return await UserModel.findById(id);
}

export const updateUser = async (id: number, data: UserRequest) => {
    return await UserModel.update(id, data);
}

export const deleteUser = async (id: number) => {
    return await UserModel.delete(id);
}