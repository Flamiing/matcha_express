import { Client, QueryResult } from 'pg';
import db from '../config/databaseConnection';

export default class BaseModel<T extends {}> {
    protected tableName: string;
    protected db: Client;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.db = db;
    }

    protected async newQuery(
        text: string,
        values: string[] | null
    ): Promise<QueryResult<any>> {
        // Using this function we can make SQL Injection safe queries to the db.
        const query = {
            text: text,
            values: values,
        };
        const result = await this.db.query(query);
        return result;
    }

    public async getAll(): Promise<T[]> {
        try {
            const result = await this.newQuery(
                `SELECT * FROM ${this.tableName}`,
                null
            );
            return result.rows as T[];
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching record from ${this.tableName} table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record from ${this.tableName} table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async getById(id: number): Promise<T | undefined> {
        try {
            const result = await this.newQuery(
                `SELECT * FROM ${this.tableName} WHERE id=$1`,
                [id.toString()]
            );
            return result.rows as T | undefined;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error fetching record with ID ${id} from ${this.tableName} table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record with ID ${id} from ${this.tableName} table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async update(
        id: number,
        data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<T | undefined> {
        //const trx = await db.transaction();
        try {
            /* const [record] = await trx<T>('users')
                .where('id', id.toString())
                .update({ ...data, updated_at: new Date() })
                .returning('*');
            await trx.commit();
            return record; */
            const currentTime = new Date();
            const result = await this.newQuery(
                `UPDATE ${this.tableName} SET  RETURNING *`,
                [tokenData.user_id, tokenData.token, tokenData.type, currentTime, currentTime]
            );
            return result.rows as T;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error updating record with ID ${id} from ${this.tableName} table:`,
                    error.message
                );
                throw new Error(
                    `Could not update record with ID ${id} from ${this.tableName} table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async delete(id: number): Promise<number> {
        try {
            const result = await this.newQuery(
                `DELETE FROM ${this.tableName} WHERE id=$1`,
                [id.toString()]
            );
            return result.rowCount;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error deleting record with ID ${id} from ${this.tableName} table:`,
                    error.message
                );
                throw new Error(
                    `Could not delete user with ID ${id} from ${this.tableName} table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }
}
