import db from '../config/databaseConnection';

export default class BaseModel<T extends {}> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    public async findAll(): Promise<T[]> {
        try {
            return await db<T>(this.tableName).select('*');
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

    public async findById(id: number): Promise<T | undefined> {
        try {
            return await db<T>(this.tableName)
                .where('id', id.toString())
                .first();
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
        const trx = await db.transaction();
        try {
            const [record] = await trx<T>('users')
                .where('id', id.toString())
                .update({ ...data, updated_at: new Date() })
                .returning('*');
            await trx.commit();
            return record;
        } catch (error) {
            await trx.rollback();
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
            return await db<T>(this.tableName).where({ id }).del();
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
