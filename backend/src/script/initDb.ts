import pool from '../config/database';
import db from '../config/database';
import listOfTables from './templatesDb';
import listOfTableCreationFunctions from './createTables';

// const initDb = async () => {
//   try {
//     await pool.query('BEGIN');
//     for (const table of listOfTables) {
//       await pool.query(table);
//     }
//     await pool.query('COMMIT');
//     console.log('All tables created');
//   } catch (err) {
//     console.error('Error initializing the database', err);
//     await pool.query('ROLLBACK');
//   }
// };

// export default initDb;

const initDb = async () => {
	try {
		await db.transaction(async (trx) => {
			for (const createTable of listOfTableCreationFunctions) {
				await createTable(trx);
			}
		});
		console.log('All tables created successfully');
	} catch (err) {
		console.error('Error initializing the database', err);
	}
};

export default initDb;
