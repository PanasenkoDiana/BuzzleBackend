import { Server } from "socket.io";

type ChatSocketHandler = (io: Server) => void;

const chatSocket: ChatSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join_group", (groupId: string | number) => {
      socket.join(groupId.toString());
      console.log(`User ${socket.id} joined group ${groupId}`);
    });

    socket.on("group_message", (data: { groupId?: string | number; message: string; senderId: number }) => {
      const { groupId, message, senderId } = data;
      if (!groupId) {
        console.warn("Received group_message without groupId");
        return;
      }
      io.to(groupId.toString()).emit("group_message", {
        senderId,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
