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

    public async getByToken(token: string): Promise<UserToken | undefined> {
        try {
            const result = await this.newQuery(
                `SELECT * FROM ${this.tableName} WHERE token=$1`,
                [token]
            );
            return result.rows as UserToken | undefined;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching record by token from '${this.tableName}' table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record by token from '${this.tableName}' table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async create(
        tokenData: Omit<UserToken, 'id' | 'created_at' | 'updated_at'>
    ): Promise<UserToken> {
        try {
            const currentTime = new Date();
            const result = await this.newQuery(
                `INSERT INTO ${this.tableName} (user_id, token, type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [tokenData.user_id, tokenData.token, tokenData.type, currentTime, currentTime]
            );
            return result.rows as UserToken;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating token:', error.message);
                throw new Error('Could not create token');
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async update(
        id: number,
        data: Partial<Omit<UserToken, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<T | undefined> {
        const fields = Object.keys(data) 
        const values = Object.values(data) 
        return super.update(id, fields, values)
    }
}

const userTokenModel = new UserTokenModel();
export default userTokenModel;
