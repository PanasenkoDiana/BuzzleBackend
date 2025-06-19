import { Server } from 'socket.io';
import { ChatSocket } from './chat.socket';

export const initializeSockets = (server: any) => {
    const io = new Server(server);

    
    ChatSocket(io);

    return io;
};