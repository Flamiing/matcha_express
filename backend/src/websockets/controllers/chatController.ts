// src/websocket/controllers/chatController.ts
import { Socket } from 'socket.io';

export const handleChat = (socket: Socket) => {
    socket.on('sendMessage', ({ roomId, message }) => {
        // Send message to all clients in the room
        socket.to(roomId).emit('receiveMessage', message);
    });
};
