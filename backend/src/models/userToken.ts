import db from '../config/databaseConnection';

interface UserToken {
    id: number;
    user_id: number;
    token: string;
    type: string; // 'verification', 'reset', 'auth', 'refresh'
    created_at?: Date;
    updated_at?: Date;
    expires_at: Date;
}

const UserTokenModel = {
    findAll: async (): Promise<UserToken[]> => {
        try {
            return await db<UserToken>('user_tokens').select('*');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching tokens:', error.message);
                throw new Error('Could not fetch tokens');
            }
            throw new Error('Unknown error occurred');
        }
    },

    findById: async (id: number): Promise<UserToken | undefined> => {
        try {
            return await db<UserToken>('user_tokens').where({ id }).first();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching token with ID ${id}:`,
                    error.message
                );
                throw new Error(`Could not fetch token with ID ${id}`);
            }
            throw new Error('Unknown error occurred');
        }
    },

    findByToken: async (token: string): Promise<UserToken | undefined> => {
        try {
            return await db<UserToken>('user_tokens').where({ token }).first();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error fetching token:`, error.message);
                throw new Error('Could not fetch token');
            }
            throw new Error('Unknown error occurred');
        }
    },

    create: async (
        tokenData: Omit<UserToken, 'id' | 'created_at'>
    ): Promise<UserToken> => {
        try {
            const [token] = await db<UserToken>('user_tokens')
                .insert({ ...tokenData, created_at: new Date() })
                .returning('*');
            return token;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating token:', error.message);
                throw new Error('Could not create token');
            }
            throw new Error('Unknown error occurred');
        }
    },

    update: async (
        id: number,
        tokenData: Partial<Omit<UserToken, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<UserToken | undefined> => {
        try {
            const [token] = await db<UserToken>('user_tokens')
                .where({ id })
                .update({ ...tokenData, updated_at: new Date() })
                .returning('*');
            return token;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error updating token with ID ${id}:`,
                    error.message
                );
                throw new Error(`Could not update token with ID ${id}`);
            }
            throw new Error('Unknown error occurred');
        }
    },

    delete: async (id: number): Promise<number> => {
        try {
            return await db<UserToken>('user_tokens').where({ id }).del();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error deleting token with ID ${id}:`,
                    error.message
                );
                throw new Error(`Could not delete token with ID ${id}`);
            }
            throw new Error('Unknown error occurred');
        }
    },
};

export default UserTokenModel;
