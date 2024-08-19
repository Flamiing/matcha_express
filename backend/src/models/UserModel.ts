import db from '../config/databaseConnection';
import BaseModel from './BaseModel';

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

class UserModel extends BaseModel<User> {
    constructor() {
        super('users');
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        try {
            return await db<User>(this.tableName).where({ email }).first();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching record with email ${email} from ${this.tableName} table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record with email ${email} from ${this.tableName} table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async create(
        userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
    ): Promise<User> {
        const trx = await db.transaction();
        try {
            const [user] = await trx<User>(this.tableName)
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
    }
}

const userModel = new UserModel();
export default userModel;
