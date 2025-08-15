import { Server as SocketIOServer } from "socket.io";
import { ChatUsecase } from "../../application/useCases/implimentations/chatUseCase"; 
import { registerSlotEvents } from "./slotSocketHandlers";
import dotenv from "dotenv";
dotenv.config();

const FRONT_END_URL = process.env.FRONT_END_URL;


let io: SocketIOServer;

export const initializeSocket = (server: any) => {
  io = new SocketIOServer(server, {
    pingTimeout: 60000,
    pingInterval: 25000,
    
    cors: {
      origin: FRONT_END_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  });

  const connectedUsers = new Map()
  const callTimeouts = new Map()


  console.log("Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("setup", (userId) => {
      connectedUsers.set(userId, socket.id);
      (socket.data as any).userId = userId;
      socket.join(userId);
      socket.emit("connected");
    });
    
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined Room: ", room);
    });

    socket.on("mark messages as read", async ({ chatId, receiverId }) => {
      try {
        const chatUsecase = new ChatUsecase()
        await chatUsecase.markMessagesAsRead(chatId, receiverId)

        socket.to(chatId).emit("messages read", { chatId })
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    })

    socket.on("send message", (message) => {
      const { chatId, senderId, receiverId, text } = message;
      const messageWithReadStatus = { ...message, read: false }
      
      socket.to(receiverId).emit("receive message", messageWithReadStatus);
      console.log(`Message sent in chat: ${chatId} from ${senderId} to ${receiverId}: ${text}`);
    });

    // Handle the start of a video call
    socket.on("join video chat", ({ chatId, userId }) => {
      socket.join(`video-${chatId}`)
      console.log(`User ${userId} (${socket.id}) joined video chat: ${chatId}`)
    })

    socket.on("start video call", ({ chatId, receiverId, callerId }) => {
      console.log(`Starting video call from ${callerId} to ${receiverId} in chat ${chatId}`);

      // Set a timeout to automatically end the call if not answered
      const timeout = setTimeout(() => {
        socket.to(receiverId).emit("call ended")
        socket.emit("call ended")
        callTimeouts.delete(chatId)
      }, 40000) 

      callTimeouts.set(chatId, timeout)

      // Emit to the receiver that a video call is incoming
      socket.to(receiverId).emit("incoming video call", {
        chatId,
        callerId,
      });

      console.log(`Video call notification sent to receiver ${receiverId}`);
    });

    socket.on("accept call", ({ chatId, callerId, receiverId }) => {
      // Clear the timeout when call is accepted
      const timeout = callTimeouts.get(chatId)
      if (timeout) {
        clearTimeout(timeout)
        callTimeouts.delete(chatId)
      }

      socket.to(`video-${chatId}`).emit("call accepted")
      console.log(`Call accepted in chat ${chatId}, Caller: ${callerId} and Receiver: ${receiverId}`)
    });

    socket.on("reject call", ({ chatId }) => {
      // Clear the timeout when call is rejected
      const timeout = callTimeouts.get(chatId)
      if (timeout) {
        clearTimeout(timeout)
        callTimeouts.delete(chatId)
      }

      socket.to(`video-${chatId}`).emit("call rejected")
      console.log(`Call rejected in chat ${chatId}`)
    }) 
    
    socket.on("offer", ({ chatId, offer }) => {
      socket.to(`video-${chatId}`).emit("offer", offer)
      console.log(`Offer sent in chat ${chatId}`)
    })

    socket.on("answer", ({ chatId, answer }) => {
      socket.to(`video-${chatId}`).emit("answer", answer)
      console.log(`Answer sent in chat ${chatId}`)
    })

    socket.on("ice-candidate", ({ chatId, candidate }) => {
      socket.to(`video-${chatId}`).emit("ice-candidate", candidate)
      console.log(`ICE candidate sent in chat ${chatId}`)
    })

    socket.on("end call", ({ chatId }) => {
      // Clear the timeout when call is ended
      const timeout = callTimeouts.get(chatId)
      if (timeout) {
        clearTimeout(timeout)
        callTimeouts.delete(chatId)
      }

      socket.to(`video-${chatId}`).emit("call ended")
      console.log(`Call ended in chat ${chatId}`)
    })

    socket.on("signal", ({ chatId, userId, receiverId, signal }) => {
      console.log(chatId);
      
      const receiverSocketId = connectedUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("signal", { signal, userId })
      }
    })

    socket.on("end call", ({ chatId, userId, receiverId }) => {
      console.log(`Call ending in chat ${chatId} between ${userId} and ${receiverId}`);
      
      const receiverSocketId = connectedUsers.get(receiverId);
      const callerSocketId = connectedUsers.get(userId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call ended");
      }
      if (callerSocketId) {
        io.to(callerSocketId).emit("call ended");
      }
    
      // Cleanup timeouts
      const timeout = callTimeouts.get(chatId);
      if (timeout) {
        clearTimeout(timeout);
        callTimeouts.delete(chatId);
      }
    
      console.log(`Call ended in chat ${chatId} between ${userId} and ${receiverId}`);
    })

    registerSlotEvents(io, socket);

    socket.on("disconnect", () => {
      // Clear any active call timeouts for this user
      for (const [chatId, timeout] of callTimeouts.entries()) {
        clearTimeout(timeout)
        callTimeouts.delete(chatId)
      }

      // Remove user from connected users map
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId)
          break
        }
      }

      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};