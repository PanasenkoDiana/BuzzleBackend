import { Server } from "socket.io";

const chatSocket = (server) => {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);

       
        socket.on("private_message", ({ recipientId, message }) => {
            socket.to(recipientId).emit("private_message", {
                senderId: socket.id,
                message,
            });
        });

        
        socket.on("join_group", (groupId) => {
            socket.join(groupId);
            console.log(`User ${socket.id} joined group ${groupId}`);
        });

        socket.on("group_message", ({ groupId, message }) => {
            io.to(groupId).emit("group_message", {
                senderId: socket.id,
                message,
            });
        });

        
        socket.on("regular_message", (message) => {
            io.emit("regular_message", {
                senderId: socket.id,
                message,
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export default chatSocket;