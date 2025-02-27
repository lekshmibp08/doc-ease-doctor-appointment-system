import { io, type Socket } from "socket.io-client"
const BASE_URL = import.meta.env.BASE_URL 

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

