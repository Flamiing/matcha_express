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

    public async getByEmail(email: string): Promise<User | undefined> {
        try {
            const result = await this.newQuery(
                `SELECT * FROM ${this.tableName} WHERE email=$1`,
                [email]
            );
            return result.rows as User | undefined;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching record with email ${email} from '${this.tableName}' table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record with email ${email} from '${this.tableName}' table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async create(
        data: Omit<User, 'id' | 'created_at' | 'updated_at'>
    ): Promise<User> {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const currentTime = new Date();
        fields.push(...['created_at', 'updated_at']);
        values.push(...[currentTime, currentTime]);
        return super.create(fields, values);
    }

    public async update(
        id: number,
        data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<User | undefined> {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const currentTime = new Date();
        fields.push('updated_at');
        values.push(currentTime)
        return super.update(id, fields, values);
    }
}

const userModel = new UserModel();
export default userModel;
