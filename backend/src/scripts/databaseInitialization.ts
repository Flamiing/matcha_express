import db from '../config/databaseConnection';
import listOfTableCreationFunctions from './createTables';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const addAdminSuperUser = async () => {
    if (!(await db.schema.hasTable('users'))) {
        return;
    }
    const user = await db('users').where('username', 'admin').first();
    if (user) {
        console.log('Superuser admin already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash(
        `${process.env.ADMIN_PASSWORD}`,
        10
    );
    const superUser = {
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        is_verified: true,
        is_admin: true,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
    };
    try {
        await db('users').insert(superUser).returning('id');
        console.log('Superuser admin created successfully');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding superuser admin:', error.message);
        } else {
            console.error('Unknown error adding superuser admin');
        }
    }
};

const initDb = async () => {
    try {
        await db.transaction(async (trx) => {
            for (const createTable of listOfTableCreationFunctions) {
                await createTable(trx);
            }
        });

        await addAdminSuperUser();

        console.log('All tables created successfully');
    } catch (err) {
        console.error('Error initializing the database', err);
    }
};

export default initDb;
