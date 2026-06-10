import { useEffect, useState } from "react"
import socket from "@/lib/socket"
import { Message } from "@/types"

export function useChat(groupId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    socket.emit("join_group", { groupId })

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off("receive_message")
      socket.emit("leave_group", { groupId })
    }
  }, [groupId])

  const sendMessage = (content: string) => {
    socket.emit("send_message", { groupId, content })
  }

  return { messages, isLoading, sendMessage }
}
