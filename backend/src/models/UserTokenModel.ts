import db from '../config/databaseConnection';
import BaseModel from './BaseModel';

interface UserToken {
    id: number;
    user_id: number;
    token: string;
    type: string; // 'verification', 'reset', 'auth', 'refresh'
    created_at?: Date;
    updated_at?: Date;
    expires_at: Date;
}

class UserTokenModel extends BaseModel<UserToken> {
    constructor() {
        super('user_tokens');
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        try {
            return await db<UserToken>(this.tableName).where({ token }).first();
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching record by token from ${this.tableName} table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record by token from ${this.tableName} table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async create(
        tokenData: Omit<UserToken, 'id' | 'created_at'>
    ): Promise<UserToken> {
        const trx = await db.transaction();
        try {
            const [token] = await trx<UserToken>(this.tableName)
                .insert({ ...tokenData, created_at: new Date() })
                .returning('*');
            await trx.commit();
            return token;
        } catch (error) {
            await trx.rollback();
            if (error instanceof Error) {
                console.error('Error creating token:', error.message);
                throw new Error('Could not create token');
            }
            throw new Error('Unknown error occurred');
        }
    }
}

const userTokenModel = new UserTokenModel();
export default userTokenModel;
