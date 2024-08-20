import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userModel from '../models/UserModel';

dotenv.config();

const addAdminSuperUser = async () => {
    const hashedPassword = await bcrypt.hash(
        `${process.env.ADMIN_PASSWORD}`,
        10
    );
    const superUser = {
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        first_name: 'admin',
        last_name: 'admin',
        is_verified: true,
        is_admin: true,
    };
    try {
        await userModel.create(superUser);
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
        await addAdminSuperUser();
        console.log('All tables created successfully');
    } catch (err) {
        console.error('Error initializing the database', err);
    }
};

export default initDb;
