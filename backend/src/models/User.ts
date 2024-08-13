// src/models/User.ts
import db from '../config/database';

interface User {
  id: number;
  username?: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  email_verified_at?: Date | null;
  password_reset_expires_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

const UserModel = {
  findAll: async (): Promise<User[]> => {
    return await db<User>('users').select('*');
  },

  findById: async (id: number): Promise<User | undefined> => {
    return await db<User>('users').where({ id }).first();
  },

  findByEmail: async (email: string): Promise<User | undefined> => {
    return await db<User>('users').where({ email }).first();
  },

  create: async (
    userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
  ): Promise<User> => {
    const [user] = await db<User>('users')
      .insert({ ...userData, created_at: new Date(), updated_at: new Date() })
      .returning('*');
    return user;
  },

  update: async (
    id: number,
    userData: Partial<Omit<User, 'id' | 'created_at'>>
  ): Promise<User | undefined> => {
    const [user] = await db<User>('users')
      .where({ id })
      .update({ ...userData, updated_at: new Date() })
      .returning('*');
    return user;
  },

  delete: async (id: number): Promise<number> => {
    return await db<User>('users').where({ id }).del();
  },
};

export default UserModel;
