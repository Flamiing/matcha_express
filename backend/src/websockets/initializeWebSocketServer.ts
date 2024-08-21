// src/websockets/initializeWebSocketServer.ts

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import corsOptions from '../config/corsOptions';
import authSocketMiddleware from './middlewares/authSocketMiddleware';
// Routes
import notificationRoutes from './routes/notificationRoutes';
import webRTCRoutes from './routes/webRTCRoutes';
// import chatRoutes from './routes/chatRoutes';

export const initializeWebSocketServer = (server: HTTPServer) => {
    try {
        const io = new SocketIOServer(server, {
            cors: {
                origin: corsOptions.origin,
                methods: corsOptions.methods || ['GET', 'POST'],
                credentials: corsOptions.credentials || true,
            },
        });

        io.on('error', (error) => {
            console.error('Socket.IO server error:', error);
        });

        // Apply the authentication middleware to all namespaces
        io.use(authSocketMiddleware);

        // Namespace Routes
        notificationRoutes(io.of('/ws/notification'));
        // webRTCRoutes(io.of('/ws/webrtc'));
        // chatRoutes(io.of('/ws/chat'), webSocketService);

        console.log('WebSocket server initialized successfully');
        return io;
    } catch (err) {
        console.error('Error initializing WebSocket server:', err);
        process.exit(1);
    }
};
