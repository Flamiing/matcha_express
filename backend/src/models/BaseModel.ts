import { Client, QueryResult } from 'pg';
import db from '../config/databaseConnection';

export default class BaseModel<T extends {}> {
    protected tableName: string;
    protected db: Client;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.db = db;
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
                    `Error fetching record from '${this.tableName}' table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record from '${this.tableName}' table`
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
                    `Error fetching record with ID ${id} from '${this.tableName}' table:`,
                    error.message
                );
                throw new Error(
                    `Could not fetch record with ID ${id} from '${this.tableName}' table`
                );
            }
            throw new Error('Unknown error occurred');
        }
    }

    public async update(
        id: number,
        fields: string[],
        values: string[]
    ): Promise<T | undefined> {
        try {
            const formatedFields = this.formatFieldsForUpdate(fields);
            const lastPos = values.length + 1;
            values.push(id.toString());
            const currentTime = new Date();
            console.log('FORMATED: ', formatedFields);
            console.log('VALUES: ', values);
            const result = await this.newQuery(
                `UPDATE ${this.tableName} SET ${formatedFields} WHERE id=$${lastPos} RETURNING *`,
                values
            );
            return result.rows as T;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error updating record with ID ${id} from '${this.tableName}' table:`,
                    error.message
                );
                throw new Error(
                    `Could not update record with ID ${id} from '${this.tableName}' table`
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
                    `Error deleting record with ID ${id} from '${this.tableName}' table:`,
                    error.message
                );
                throw new Error(
                    `Could not delete user with ID ${id} from '${this.tableName}' table`
                );
            }
            throw new Error('Unknown error occurred');
        }
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

    private formatFieldsForUpdate(raw_fields: string[]): string {
        const fields = raw_fields.map((item, index) => `${item} = $${index + 1}`).join(', ');
        return fields
    }
}
