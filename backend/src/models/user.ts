import db from '../config/databaseConnection';

interface User {
    id: number;
    username?: string;
    email: string;
    password: string;
    is_verified?: boolean;
    is_admin?: boolean;
    email_verified_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

const UserModel = {
    findAll: async (): Promise<User[]> => {
        try {
            return await db<User>('users').select('*');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching users:', error.message);
                throw new Error('Could not fetch users');
            }
            throw new Error('Unknown error occurred');
        }
    },

    findById: async (id: number): Promise<User | undefined> => {
        try {
            return await db<User>('users').where({ id }).first();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching user with ID ${id}:`,
                    error.message
                );
                throw new Error(`Could not fetch user with ID ${id}`);
            }
            throw new Error('Unknown error occurred');
        }
    },

    findByEmail: async (email: string): Promise<User | undefined> => {
        try {
            return await db<User>('users').where({ email }).first();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching user with email ${email}:`,
                    error.message
                );
                throw new Error(`Could not fetch user with email ${email}`);
            }
            throw new Error('Unknown error occurred');
        }
    },

    create: async (
        userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
    ): Promise<User> => {
        const trx = await db.transaction();
        try {
            const [user] = await trx<User>('users')
                .insert({
                    ...userData,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning('*');
            await trx.commit();
            return user;
        } catch (error) {
            await trx.rollback();
            if (error instanceof Error) {
                console.error('Error creating user:', error.message);
                throw new Error('Could not create user');
            }
            throw new Error('Unknown error occurred');
        }
    },

    update: async (
        id: number,
        userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<User | undefined> => {
        const trx = await db.transaction();
        try {
            const [user] = await trx<User>('users')
                .where({ id })
                .update({ ...userData, updated_at: new Date() })
                .returning('*');
            await trx.commit();
            return user;
        } catch (error) {
            await trx.rollback();
            if (error instanceof Error) {
                console.error(
                    `Error updating user with ID ${id}:`,
                    error.message
                );
                throw new Error(`Could not update user with ID ${id}`);
            }
            throw new Error('Unknown error occurred');
        }
    },

    delete: async (id: number): Promise<number> => {
        try {
            return await db<User>('users').where({ id }).del();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error deleting user with ID ${id}:`,
                    error.message
                );
                throw new Error(`Could not delete user with ID ${id}`);
            }
            throw new Error('Unknown error occurred');
        }
    },
};

export default UserModel;
