
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Chat, Message, MessageWithLoading, UserChatProps } from "../types/interfaces"
import { useSelector } from "react-redux"
import type { RootState } from "@/Redux/store"
import io from "socket.io-client"
import { ArrowLeft, Check } from "lucide-react"
import VideoCall from "./VideoCall"
import { 
  fetchUserChats, 
  createUserChat, 
  fetchChatMessages, 
  sendMessageToDoctor, 
  uploadToCloudinary 
} from "../services/api/userApi"
import { getFullImageUrl } from "../utils/getFullImageUrl"


const ENDPOINT = import.meta.env.VITE_BASE_URL
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API_URL

let socket: any

const UserChat: React.FC<UserChatProps> = ({ isOpen, onClose, initialDoctorId }) => {
  const userId = useSelector((state: RootState) => state.userAuth.currentUser?._id)
  const [messages, setMessages] = useState<MessageWithLoading[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [allChats, setAllChats] = useState<Chat[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({})
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{ chatId: string; callerId: string } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)

  const [showChatList, setShowChatList] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setShowChatList(true)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    socket = io(ENDPOINT)
    socket.emit("setup", userId)
    socket.on("connection", () => {
      console.log("Socket Connected");
    })
    

    socket.on("receive message", (message: Message) => {
      if (message.chatId === currentChat?._id) {
        setMessages((prevMessages) => [...prevMessages, message])

        socket.emit("mark messages as read", { chatId: message.chatId, userId })
      } else {
        // Increment unread count for other chats
        setUnreadCounts((prev) => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1,
        }))
      }
    })

    socket.on("messages read", ({ chatId }: { chatId: string }) => {
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.chatId === chatId ? { ...msg, read: true } : msg)))
    })

    socket.emit("join video chat", {
      chatId: currentChat?._id,
      callerId: userId,
    })

    socket.on("incoming video call", ({ chatId, callerId }: { chatId: string; callerId: string }) => {
      setIncomingCall({ chatId, callerId })
    })

    socket.emit("join video chat", {
      chatId: currentChat?._id,
      callerId: userId,
    })

    socket.on("call ended", () => {
      setIsVideoCallActive(false)
      setIncomingCall(null)
    })

    return () => {
      socket.disconnect()
    }
  }, [isOpen, userId, currentChat])

  useEffect(() => {
    if (!isOpen || !userId) return

    const fetchChats = async () => {
      try {
        const response = await fetchUserChats(userId)
        setAllChats(response.data.chats)
        setUnreadCounts(response.data.unreadCounts)

        if (initialDoctorId) {
          const chat = response.data.chats.find((c: Chat) => c.doctorId._id === initialDoctorId)
          if (chat) {
            selectChat(chat)
          } else {
            createNewChat(initialDoctorId)
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }

    fetchChats()
  }, [isOpen, userId, initialDoctorId])

  const createNewChat = async (doctorId: string) => {
    try {
      const response = await createUserChat(doctorId, userId)
      const newChat = response.data.chat
      setAllChats((prevChats) => [...prevChats, newChat])
      selectChat(newChat)
    } catch (error) {
      console.error("Error creating new chat:", error)
    }
  }

  const selectChat = async (chat: Chat) => {
    setCurrentChat(chat)
    if (isMobile) {
      setShowChatList(false)
    }
    socket.emit("join chat", chat._id)
    try {
      const response = await fetchChatMessages(chat._id)
      setMessages(response.data)
      const receiverId = userId
      socket.emit("mark messages as read", { chatId: chat._id, receiverId })
      setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }))
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !imageUrl) return

    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const skeletonMessage: MessageWithLoading = {
      _id: tempId,
      chatId: currentChat?._id || "",
      senderId: userId || "",
      receiverId: currentChat?.userId._id || '',
      text: newMessage,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString(),
      read: false,
      isLoading: true,
      tempId: tempId,
    }

    setMessages((prevMessages) => [...prevMessages, skeletonMessage])

    const messageText = newMessage
    const currentImageUrl = imageUrl
    setNewMessage("")
    setImagePreview(null)
    setImageUrl("")

    const messageData = {
      chatId: currentChat?._id,
      senderId: userId,
      receiverId: currentChat?.doctorId._id,
      text: messageText,
      imageUrl: currentImageUrl,
      timestamp: new Date().toISOString(),
      read: false,
    }

    try {
      const response = await sendMessageToDoctor(messageData)
      socket.emit("send message", messageData)
      setMessages((prevMessages) => prevMessages.map((msg) =>
        (msg.tempId === tempId ? response.data : msg)
      ))
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.tempId !== tempId))
      setNewMessage(messageText)
      setImageUrl(currentImageUrl)
      if (currentImageUrl) {
        setImagePreview(currentImageUrl)
      }

      alert("Failed to send message. Please try again.")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const previewURL = URL.createObjectURL(file)
    setImagePreview(previewURL)
    setIsImageUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME)

      const response = await uploadToCloudinary(formData, CLOUDINARY_API_URL)

      if (!response.data.secure_url) {
        throw new Error("Image upload to Cloudinary failed")
      }

      const uploadedImageUrl = response.data.secure_url
      setImageUrl(uploadedImageUrl)
      setImagePreview(uploadedImageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      setImagePreview(null)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsImageUploading(false)
    }
  }

  const startVideoCall = () => {
    if (currentChat) {
      setIsVideoCallActive(true) // Set the video call state to active
      socket.emit("start video call", {
        chatId: currentChat._id,
        receiverId: currentChat.doctorId._id,
        callerId: userId,
      })
    }
  }

  const handleAccept = () => {
    setIsVideoCallActive(true)

    socket.emit("accept call", {
      chatId: currentChat?._id,
      callerId: incomingCall?.callerId,
      receiverId: userId,
    })
    setIncomingCall(null) 
  }

  const handleReject = () => {
    setIncomingCall(null) 
    setIsVideoCallActive(false)

    socket.emit("reject call", {
      chatId: currentChat?._id,
      receiverId: userId,
    })
  }

  const handleBackToList = () => {
    setShowChatList(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[580px] flex overflow-hidden">
        {/* Chat List */}
        <div
          className={`${isMobile ? "w-full" : "w-1/3"} bg-gray-100 border-r border-gray-300 flex flex-col
          ${isMobile && !showChatList ? "hidden" : "block"}`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="font-bold text-xl">Chats</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <input type="text" placeholder="Search a chat" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {allChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => selectChat(chat)}
                className={`p-4 cursor-pointer flex items-center ${
                  currentChat?._id === chat._id ? "bg-blue-100" : "hover:bg-gray-200"
                }`}
              >
                <img
                  src={chat.doctorId.profilePicture || "/placeholder-user.jpg"}
                  alt={chat.doctorId.fullName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="font-bold">{chat.doctorId.fullName}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {chat.lastMessage ? chat.lastMessage.text : "No messages yet"}
                  </div>
                </div>
                {unreadCounts[chat._id] > 0 && (
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {unreadCounts[chat._id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content */}
        <div className={`flex-1 flex flex-col ${isMobile && showChatList ? "hidden" : "block"}`}>
          {currentChat ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  {isMobile && (
                    <button onClick={handleBackToList} className="mr-2">
                      <ArrowLeft className="h-6 w-6 text-blue-500 text-2xl" />
                    </button>
                  )}
                  <img
                    src={currentChat.doctorId.profilePicture || "/placeholder-user.jpg"}
                    alt={currentChat.doctorId.fullName}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="font-bold text-lg">{currentChat.doctorId.fullName}</div>
                </div>
                <button onClick={startVideoCall} className="text-blue-500">
                  <i className="fas fa-video text-3xl"></i> 
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
                {messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`flex mb-4 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
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
                          msg.senderId === userId ? "bg-blue-500 text-white" : "bg-white"
                        }`}
                      >
                        {msg.text && <p className="break-words">{msg.text}</p>}
                        {msg.imageUrl && (
                          <div
                            className="overflow-hidden rounded-lg mt-2 border
                           border-gray-300 w-[150px] h-[150px] md:w-[250px] md:h-[250px]"
                          >
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
                          {msg.senderId === userId && (
                            <Check className={`h-4 w-4 ${msg.read ? "text-green-700" : "text-gray-300"}`} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-300">
                {imagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-xs h-auto rounded-lg border border-gray-300"
                    />
                    {isImageUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white text-sm">Uploading...</div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setImagePreview(null)
                        setImageUrl("")
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter') sendMessage()
                    }}
                    placeholder="Type a message"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                  <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
              Select a chat or start a new conversation
            </div>
          )}
        </div>
      </div>

      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="mb-4">Incoming call from {currentChat?.doctorId.fullName}</p>
            <button onClick={handleAccept} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              Accept
            </button>
            <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded">
              Reject
            </button>
          </div>
        </div>
      )}

      {isVideoCallActive && currentChat && userId && (
        <VideoCall
          chatId={currentChat._id}
          userId={userId}
          otherUserName={currentChat.doctorId.fullName}
          onClose={() => setIsVideoCallActive(false)}
        />
      )}
    </div>
  )
}

export default UserChat

