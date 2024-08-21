// src/websockets/services/notificationService.ts

import { Socket } from 'socket.io';
import socketHandler from '../utils/socketHandler';

const notificationService = {
    sendNotification(socket: Socket, data: any) {
        if (!socket.data.user.is_admin) {
            return socketHandler.broadcastToSelf(
                socket,
                'Unauthorized to send messages'
            );
        }

        socketHandler.broadcast(socket, 'receiveNotification', data);
    },

    sendNotificationToUser(socket: Socket, data: any) {
        if (socketHandler.getOnlineUsers().includes(data.userId)) {
            socketHandler.broadcastToUser(socket, data.userId, data);
        } else {
            // Handle offline user scenario (e.g., save the notification to the database)
        }

        // Acknowledge the sender
        socketHandler.broadcastToSelf(
            socket,
            'Notification sent to user ' + data.userId
        );
    },

    handleDisconnect(socket: Socket) {
        socketHandler.broadcast(
            socket,
            'updateOnlineUsers',
            socketHandler.removeUserFromOnlineUsers(socket.id)
        );
        // Database logic to update user status last seen time
    },
};

export default notificationService;
