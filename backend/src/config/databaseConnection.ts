import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db: Knex = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST || 'localhost',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'postgres',
    },
});

export default db;
