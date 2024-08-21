// src/websockets/utils/socketHandler.ts

import { Socket, Server } from 'socket.io';

class SocketHandler {
    // Map to store online users <userId, socketId>
    private onlineUsers: Map<string, string>;
    // Singleton instance
    private static instance: SocketHandler;

    constructor() {
        this.onlineUsers = new Map();
    }

    public static getInstance(): SocketHandler {
        if (!SocketHandler.instance) {
            SocketHandler.instance = new SocketHandler();
        }
        return SocketHandler.instance;
    }

    // ----------------- Online Users Helper Methods -----------------

    addUserToOnlineUsers(userId: string, socketId: string): string[] {
        console.log(`Adding user ${userId} to online users`);
        this.onlineUsers.set(userId, socketId);
        return this.getOnlineUsers();
    }

    removeUserFromOnlineUsers(socketId: string): string[] {
        for (let [userId, storedSocketId] of this.onlineUsers) {
            if (storedSocketId === socketId) {
                console.log(`Removing user ${userId} from online users`);
                this.onlineUsers.delete(userId);
                break;
            }
        }
        return this.getOnlineUsers();
    }

    getOnlineUsers(): string[] {
        return Array.from(this.onlineUsers.keys());
    }

    // ----------------- Socket IO Helper Methods -----------------

    broadcast(socket: Socket, event: string, data: any): void {
        socket.broadcast.emit(event, data);
    }

    broadcastIncludingSelf(socket: Socket, event: string, data: any): void {
        socket.emit(event, data);
        socket.broadcast.emit(event, data);
    }

    broadcastToUser(socket: Socket, userId: string, data: any): void {
        const targetSocketId = this.onlineUsers.get(userId);
        if (targetSocketId) {
            socket.to(targetSocketId).emit('receiveNotification', data);
        } else {
            // Handle offline user scenario (e.g., save the notification to the database)
        }
    }

    broadcastToSelf(socket: Socket, data: any): void {
        socket.emit('receiveNotification', data);
    }

    // ----------------- WebRTC Helper Methods -----------------

    addToRoom(socket: Socket, room: string): void {
        socket.join(room);
    }

    removeFromRoom(socket: Socket, room: string): void {
        socket.leave(room);
    }

    emitToRoom(io: Server, room: string, event: string, data: any): void {
        io.to(room).emit(event, data);
    }

    broadcastToRoom(
        socket: Socket,
        room: string,
        event: string,
        data: any
    ): void {
        socket.to(room).emit(event, data);
    }

    getRooms(socket: Socket): string[] {
        return Array.from(socket.rooms);
    }
}

export default SocketHandler.getInstance();
