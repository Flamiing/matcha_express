// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
//   port: parseInt(process.env.POSTGRES_PORT || '5432'),
// });
// console.log(process.env.POSTGRES_USER);
// console.log(process.env.POSTGRES_HOST);
// console.log(process.env.POSTGRES_DB);
// console.log(process.env.POSTGRES_PASSWORD);
// console.log(process.env.POSTGRES_PORT);

// pool.on('connect', () => {
//   console.log('Connected to the database');
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// export default pool;

import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.POSTGRES_HOST,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
	},
});

export default db;
