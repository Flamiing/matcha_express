import pool from '../config/database';
import listOfTables from './templatesDb';

const initDb = async () => {
  try {
    await pool.query('BEGIN');
    for (const table of listOfTables) {
      await pool.query(table);
    }
    await pool.query('COMMIT');
    console.log('All tables created');
  } catch (err) {
    console.error('Error initializing the database', err);
    await pool.query('ROLLBACK');
  }
};

export default initDb;
