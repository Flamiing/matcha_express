import { Socket } from 'socket.io';
import { sendNotificationToUser } from '../../services/websocketServices';

export const handleWebRTCEvents = (socket: Socket) => {
    socket.on(
        'webrtc:offer',
        (data: { targetUserId: string; offer: string }) => {
            sendNotificationToUser(socket, data.targetUserId, {
                type: 'WebRTCOffer',
                data: {
                    offer: data.offer,
                    callerId: socket.data.user.id,
                },
            });
        }
    );

    socket.on(
        'webrtc:reject',
        (data: { targetUserId: string; reason?: string }) => {
            sendNotificationToUser(socket, data.targetUserId, {
                type: 'WebRTCReject',
                data: {
                    reason: data.reason || 'Call rejected',
                    responderId: socket.data.user.id,
                },
            });
        }
    );

    socket.on(
        'webrtc:answer',
        (data: { targetUserId: string; answer: string }) => {
            sendNotificationToUser(socket, data.targetUserId, {
                type: 'WebRTCAnswer',
                data: {
                    answer: data.answer,
                    responderId: socket.data.user.id,
                },
            });
        }
    );

    socket.on(
        'webrtc:ice-candidate',
        (data: { targetUserId: string; candidate: any }) => {
            sendNotificationToUser(socket, data.targetUserId, {
                type: 'ICECandidate',
                data: {
                    candidate: data.candidate,
                    senderId: socket.data.user.id,
                },
            });
        }
    );

    socket.on('webrtc:call-ended', (data: { targetUserId: string }) => {
        sendNotificationToUser(socket, data.targetUserId, {
            type: 'CallEnded',
            data: {
                message: 'The call has ended.',
                initiatorId: socket.data.user.id,
            },
        });
    });

    socket.on('webrtc:reconnect-request', (data: { targetUserId: string }) => {
        sendNotificationToUser(socket, data.targetUserId, {
            type: 'ReconnectRequest',
            data: {
                message:
                    'User has reconnected. Please re-initiate the WebRTC connection.',
                requesterId: socket.data.user.id,
            },
        });
    });
};
