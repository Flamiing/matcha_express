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

export async function getAllUsers() {
    return await userModel.getAll();
}

export async function createUser(data: UserRequest) {
    return await userModel.create(data);
}

export async function getUserById(id: number) {
    return await userModel.getById(id);
}

export async function updateUser(id: number, data: UserRequest) {
    return await userModel.update(id, data);
}

export async function deleteUser(id: number) {
    return await userModel.delete(id);
}
