import type React from "react"
import { useRef, useEffect } from "react"
import { Check } from "lucide-react"
import { getFullImageUrl } from "../../utils/getFullImageUrl"

interface MessageWithLoading {
  _id?: string
  chatId: string
  senderId: string
  receiverId: string
  text?: string
  imageUrl?: string
  timestamp: string
  read: boolean
  isLoading?: boolean
  tempId?: string
}

interface MessagesContainerProps {
  messages: MessageWithLoading[]
  currentUserId: string
  _userType: "doctor" | "user"
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ messages, currentUserId, _userType }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
      {messages.map((msg, index) => (
        <div
          key={msg._id || index}
          className={`flex mb-4 ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
        >
          {msg.isLoading ? (
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%] animate-pulse">
              {msg.text && <p className="break-words opacity-70">{msg.text}</p>}
              {msg.imageUrl && (
                <div className="overflow-hidden rounded-lg mt-2 border border-gray-300 w-[150px] h-[150px] md:w-[250px] md:h-[250px] opacity-70">
                  <img
                    src={getFullImageUrl(msg.imageUrl) || "/placeholder.svg"}
                    alt="Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-end gap-1 mt-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-300 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs opacity-50 ml-1">Sending...</span>
              </div>
            </div>
          ) : (
            <div
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {msg.text && <p className="break-words">{msg.text}</p>}
              {msg.imageUrl && (
                <div className="overflow-hidden rounded-lg mt-2 border border-gray-300 w-[150px] h-[150px] md:w-[250px] md:h-[250px]">
                  <img
                    src={getFullImageUrl(msg.imageUrl) || "/placeholder.svg"}
                    alt="Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.senderId === currentUserId && (
                  <Check className={`h-4 w-4 ${msg.read ? "text-green-700" : "text-gray-300"}`} />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesContainer
