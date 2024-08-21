// src/server.ts

import http, { Server } from 'http';
import app from './app';
// Database Initialization
import initDb from './scripts/databaseInitialization';
// Cron Jobs
import initializeCronJobs from './scripts/cronJobs';
// Socket.io
import { initializeWebSocketServer } from './websockets/initializeWebSocketServer';

const port: number = 8000;

const startServer = async () => {
    try {
        await initDb();
        initializeCronJobs();

        const server: Server = http.createServer(app);
        const io = initializeWebSocketServer(server);

        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to initialize the database:', err);
        process.exit(1);
    }
};

startServer();
