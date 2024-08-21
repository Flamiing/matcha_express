// src/websockets/routes/notificationRoutes.ts

import { Namespace } from 'socket.io';
import notificationController from '../controllers/notificationController';
import authSocketMiddleware from '../middlewares/authSocketMiddleware';

function notificationRoutes(notificationNamespace: Namespace) {
    // Middleware to authenticate the socket connection
    notificationNamespace.use(authSocketMiddleware);

    // Handle the connection logic
    notificationNamespace.on('connection', function (socket): void {
        notificationController.handleConnection(socket);
    });
}

export default notificationRoutes;
