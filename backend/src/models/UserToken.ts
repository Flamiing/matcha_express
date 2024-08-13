// src/models/UserToken.ts
import db from '../config/database';

interface UserToken {
  id?: number;
  user_id: number;
  token: string;
  type: string; // 'verification', 'reset', 'auth', 'refresh'
  created_at?: Date;
  updated_at?: Date;
  expires_at?: Date | null; // Nullable
}

const UserTokenModel = {
  findAll: async (): Promise<UserToken[]> => {
    return await db<UserToken>('user_tokens').select('*');
  },
  findById: async (id: number): Promise<UserToken | undefined> => {
    return await db<UserToken>('user_tokens').where({ id }).first();
  },
  findByToken: async (token: string): Promise<UserToken | undefined> => {
    return await db<UserToken>('user_tokens').where({ token }).first();
  },
  create: async (
    tokenData: Omit<UserToken, 'id' | 'created_at'>
  ): Promise<UserToken> => {
    const [token] = await db<UserToken>('user_tokens')
      .insert({ ...tokenData, created_at: new Date() })
      .returning('*');
    return token;
  },
  update: async (
    id: number,
    tokenData: Partial<Omit<UserToken, 'id' | 'created_at'>>
  ): Promise<UserToken | undefined> => {
    const [token] = await db<UserToken>('user_tokens')
      .where({ id })
      .update({ ...tokenData, updated_at: new Date() })
      .returning('*');
    return token;
  },
  delete: async (id: number): Promise<number> => {
    return await db<UserToken>('user_tokens').where({ id }).del();
  },
};

export default UserTokenModel;
