// src/websockets/controllers/webRTCControllers.ts

import { Socket } from 'socket.io';
import SocketHandler from '../utils/socketHandler';

function webRTCController(socket: Socket, webSocketService: SocketHandler) {
    try {
        socket.on('sendOffer', function (data: any) {
            webSocketService.sendWebRTCOffer(socket, data);
        });

        socket.on('sendAnswer', function (data: any) {
            webSocketService.sendWebRTCAnswer(socket, data);
        });

        socket.on('sendIceCandidate', function (data: any) {
            webSocketService.sendWebRTCIceCandidate(socket, data);
        });

        socket.on('disconnect', function () {
            webSocketService.broadcast(
                socket,
                'updateOnlineUsers',
                webSocketService.removeUserFromOnlineUsers(socket.id)
            );
            // Database logic to update user status last seen time
        });
    } catch (err) {
        console.error('Error handling connection:', err);
        socket.emit('error', 'Error handling connection');
    }
}

export default webRTCController;
