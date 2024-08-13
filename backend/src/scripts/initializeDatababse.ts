import db from '../config/databaseConnection';
import listOfTableCreationFunctions from './createTables';

export const initDb = async () => {
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
