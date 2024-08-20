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
            return result.rows[0] as UserToken | undefined;
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

    public async update(
        id: number,
        data: Partial<Omit<UserToken, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<UserToken | undefined> {
        const fields = Object.keys(data);
        const values = Object.values(data) as string[];
        const currentTime = new Date();
        fields.push('updated_at');
        values.push(currentTime.toString());
        return super.update(id, fields, values);
    }
}

const userTokenModel = new UserTokenModel();
export default userTokenModel;
