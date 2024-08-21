// src/websocket/routes/chatRoutes.ts
import { Namespace } from 'socket.io';
import { handleChat } from '../controllers/chatController';

const chatRoutes = (chatNamespace: Namespace) => {
    chatNamespace.on('connection', (socket) => {
        console.log(`Connected to /ws/chat: ${socket.id}`);
        
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        handleChat(socket);

        socket.on('disconnect', () => {
            console.log(`Disconnected from /ws/chat: ${socket.id}`);
        });
    });
};

export default chatRoutes;
