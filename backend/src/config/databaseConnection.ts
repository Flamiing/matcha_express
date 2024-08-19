import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

process.env;

const db = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432')
});

async function connectToDatabase() {
    try {
        await db.connect();
        console.log('Connected to the database.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Could not connect to the database: ', error.message);
            throw new Error('Could not connect to the database');
        }
        throw new Error('Unknown error occurred');
    }
}

connectToDatabase();

export default db;
