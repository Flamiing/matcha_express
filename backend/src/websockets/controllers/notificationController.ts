// src/websockets/controllers/notificationController.ts

import { Socket } from 'socket.io';
import notificationService from '../services/notificationService';
import socketHandler from '../utils/socketHandler';

const notificationController = {
    handleConnection(socket: Socket): void {
        try {
            // Handle pre-connection logic
            socketHandler.broadcastIncludingSelf(
                socket,
                'updateOnlineUsers',
                socketHandler.addUserToOnlineUsers(
                    socket.data.user.id,
                    socket.id
                )
            );

            // Register event handlers
            socket.on('sendNotification', function (data: any): void {
                notificationService.sendNotification(socket, data);
            });

            socket.on('sendNotificationToUser', function (data: any) {
                notificationService.sendNotificationToUser(socket, data);
            });

            socket.on('getOnlineUsers', function (): void {
                socketHandler.broadcastToSelf(
                    socket,
                    socketHandler.getOnlineUsers()
                );
            });

            socket.on('disconnect', function (): void {
                notificationService.handleDisconnect(socket);
            });
        } catch (err) {
            console.error('Error handling connection:', err);
            socket.emit('error', 'Error handling connection');
        }
    },
};

export default notificationController;
