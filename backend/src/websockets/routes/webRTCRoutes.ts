// src/websockets/routes/webRTCRoutes.ts

import { Namespace } from 'socket.io';
import webRTCController from '../controllers/webRTCControllers';
import SocketHandler from '../utils/socketHandler';
import authSocketMiddleware from '../middlewares/authSocketMiddleware';

function webRTCRoutes(
    webRTCNamespace: Namespace,
    webSocketService: SocketHandler
) {
    webRTCNamespace.use(authSocketMiddleware);
    webRTCNamespace.on('connection', function (socket) {
        try {
            webRTCController(socket, webSocketService);
        } catch (err) {
            console.error('Error handling connection:', err);
            /*
            Since this is a WebRTC route, we need to handle the error differently.
            We want to keep the socket open since the notification namespace is separate.
            When a client logs in, they automattically connect to the notification namespace.
            This webRTC namespace is only used for WebRTC signals.
            */
            webSocketService.broadcastToSelf(
                socket,
                'Error: Unable to establish WebRTC connection'
            );
        }
    });
}

export default webRTCRoutes;
