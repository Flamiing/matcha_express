import cron from 'node-cron';
import db from '../config/databaseConnection';
import { parseDuration } from '../utils/dateParsing';

// Removes all expired tokens from the database daily
const deleteExpiredTokens = async () => {
    try {
        await db('user_tokens').where('expires_at', '<', new Date()).del();
        console.log('Expired tokens deleted successfully');
    } catch (error) {
        console.error('Error deleting expired tokens:', error);
    }
};

// Removes all unverified users older than a specified period daily
const deleteUnverifiedUsers = async () => {
    try {
        await db('users')
            .where('is_verified', false)
            .andWhere(
                'created_at',
                '<',
                new Date(
                    Date.now() -
                        parseDuration(
                            process.env.UNVERIFIED_USER_DELETE_PERIOD || '7d'
                        )
                )
            )
            .del();
        console.log('Unverified users deleted successfully');
    } catch (error) {
        console.error('Error deleting unverified users:', error);
    }
};

// Initialize and schedule cron jobs
const initializeCronJobs = () => {
    // Schedule the tasks to run daily at midnight
    cron.schedule('0 0 * * *', deleteExpiredTokens);
    cron.schedule('0 0 * * *', deleteUnverifiedUsers);

    console.log('Scheduled cleanup tasks are running daily at midnight');
};

export default initializeCronJobs;
