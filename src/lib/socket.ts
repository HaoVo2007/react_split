import io from "socket.io-client"

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
})

socket.on("connect", () => {
  console.log("Socket connected:", socket.id)
})

socket.on("disconnect", () => {
  console.log("Socket disconnected")
})

export default socket
