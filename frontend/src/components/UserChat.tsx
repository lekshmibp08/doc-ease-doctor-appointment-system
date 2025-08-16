
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Chat, Message, MessageWithLoading, UserChatProps } from "../types/interfaces"
import { useSelector } from "react-redux"
import type { RootState } from "@/Redux/store"
import io from "socket.io-client"
import VideoCall from "./VideoCall"
import { 
  fetchUserChats, 
  createUserChat, 
  fetchChatMessages, 
  sendMessageToDoctor, 
  uploadToCloudinary 
} from "../services/api/userApi"
import ChatList from "./chat/ChatList"
import ChatHeader from "./chat/ChatHeader"
import MessagesContainer from "./chat/MessagesContainer"
import MessageInput from "./chat/MessageInput"
import IncomingCallModal from "./chat/IncomingCallModal"


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
        <ChatList
          chats={allChats}
          currentChat={currentChat}
          unreadCounts={unreadCounts}
          onSelectChat={selectChat}
          onClose={onClose}
          title="Chats"
          isMobile={isMobile}
          showChatList={showChatList}
          userType="user"
        />

        <div className={`flex-1 flex flex-col ${isMobile && showChatList ? "hidden" : "block"}`}>
          {currentChat ? (
            <>
              <ChatHeader
                currentChat={currentChat}
                onBack={isMobile ? handleBackToList : undefined}
                onVideoCall={startVideoCall}
                isMobile={isMobile}
                userType="user"
              />

              <MessagesContainer messages={messages} currentUserId={userId || ""} />

              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setImageUrl={setImageUrl}
                isImageUploading={isImageUploading}
                onSendMessage={sendMessage}
                onImageUpload={handleImageUpload}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
              Select a chat or start a new conversation
            </div>
          )}
        </div>

        {incomingCall && (
          <IncomingCallModal
            callerName={currentChat?.doctorId.fullName || "Unknown User"}
            onAccept={handleAccept}
            onReject={handleReject}
          />
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
    </div>
  )
}

export default UserChat

