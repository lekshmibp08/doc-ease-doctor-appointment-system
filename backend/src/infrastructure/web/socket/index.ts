import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initializeSocket = (server: any) => {
  io = new SocketIOServer(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });

  console.log("Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("setup", (userId) => {
      socket.join(userId);
      socket.emit("connected");
    });
    
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined Room: ", room);
    });

    socket.on("send message", (message) => {
      const { chatId, senderId, receiverId, text } = message;
      
      // Send message to the receiver's room
      socket.to(receiverId).emit("receive message", message);
      console.log(`Message sent from ${senderId} to ${receiverId}: ${text}`);
    });


    // Register event handlers

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};