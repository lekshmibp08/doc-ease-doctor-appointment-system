import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Chat, Message, MessageWithLoading } from "../types/interfaces"
import { useSelector } from "react-redux"
import type { RootState } from "@/Redux/store"
import io from "socket.io-client"
import VideoCall from "./VideoCall"
import { 
  sendMessagebyDoc,
  fetchChatData,
  getMessagesByChatId,
  uploadImageForSend
} from "../services/api/doctorApi"
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

const DoctorChat: React.FC = () => {
  const doctorId = useSelector((state: RootState) => state.doctorAuth.currentUser?._id)
  const [messages, setMessages] = useState<MessageWithLoading[]>([])
  const [currentChat, setCurrentChat] = useState<any>(null)
  const [allChats, setAllChats] = useState<Chat[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showChatList, setShowChatList] = useState(true)
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({})
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{ chatId: string; callerId: string } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", doctorId)
    socket.on("connection", () => console.log("Socket Connected"))

    socket.on("receive message", (message: Message) => {
      if (message.chatId === currentChat?._id) {
        setMessages((prevMessages) => [...prevMessages, message])

        socket.emit("mark messages as read", {
          chatId: message.chatId, receiverId: doctorId
        })
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1,
        }))
      }
    })

    socket.on("messages read", ({ chatId }: { chatId: string }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.chatId === chatId ? { ...msg, read: true } : msg))
      )
    })

    socket.on("incoming video call", ({ chatId, callerId }: { chatId: string, callerId: string }) => {
      console.log('Incoming video call from', callerId, 'for chat', chatId);
      setIncomingCall({ chatId, callerId })
    });

    socket.on("call ended", () => {
      setIsVideoCallActive(false)
      setIncomingCall(null)
    })

    return () => {
      socket.disconnect()
    }
  }, [doctorId, currentChat])

  useEffect(() => {
    const fetchChats = async () => {
      if (doctorId) {
        try {
          const response = await fetchChatData(doctorId);
          setAllChats(response.data.chats)
          setUnreadCounts(response.data.unreadCounts)
        } catch (error) {
          console.error("Error fetching chats:", error)
        }

      }
    }
    fetchChats()
  }, [doctorId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const selectChat = async (chat: Chat) => {
    setCurrentChat(chat)
    socket.emit("join chat", chat._id)
    try {
      const response = await getMessagesByChatId(chat._id);
      setMessages(response.data)
      
      socket.emit("mark messages as read", { chatId: chat._id, receiverId: doctorId })
      setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }))
      console.log(showChatList);      
      if (isMobile) setShowChatList(false)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if ((!newMessage.trim() && !imageUrl) || !currentChat) return;

    const tempId = `temp_${Date.now()}_${Math.random()}`;

    // Create skeleton message immediately
    const skeletonMessage: MessageWithLoading = {
      _id: tempId,
      chatId: currentChat._id,
      senderId: doctorId || "",
      receiverId: currentChat.userId._id,
      text: newMessage,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString(),
      read: false,
      isLoading: true,
      tempId: tempId,
    }

    // Add skeleton message immediately for instant feedback
    setMessages((prevMessages) => [...prevMessages, skeletonMessage])

    // Clear input immediately
    const messageText = newMessage
    const currentImageUrl = imageUrl
    setNewMessage("")
    setImagePreview(null)
    setImageUrl("")

    const messageData = {
      chatId: currentChat._id,
      senderId: doctorId,
      receiverId: currentChat.userId._id,
      text: messageText,
      imageUrl: currentImageUrl,
      timestamp: new Date().toISOString(),
      read: false,
    }

    try {
      const response = await sendMessagebyDoc(messageData)
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

      const response = await uploadImageForSend(formData, CLOUDINARY_API_URL)

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
      setIsVideoCallActive(true); 
      
      socket.emit("start video call", {
        chatId: currentChat._id,
        receiverId: currentChat.userId._id,
        callerId: doctorId
      });
    }
  };

  const handleAccept = () => {
    setIsVideoCallActive(true);
    
    socket.emit("accept call", {
      chatId: currentChat._id,
      callerId: incomingCall?.callerId,
      receiverId: doctorId
    });
    setIncomingCall(null); 
  };

  const handleReject = () => {
    setIncomingCall(null); 
    setIsVideoCallActive(false);

    socket.emit("reject call", {
      chatId: currentChat._id,
      receiverId: doctorId
    });
  };

  const handleBackToList = () => {
    setCurrentChat(null)
    setShowChatList(true)
  }



  return (
        <div className="flex h-[580px] border rounded-lg overflow-hidden">
      <ChatList
        chats={allChats}
        currentChat={currentChat}
        unreadCounts={unreadCounts}
        onSelectChat={selectChat}
        title="Chats"
        isMobile={isMobile}
        showChatList={showChatList}
        userType="doctor"
      />

      <div className={`flex-1 flex flex-col ${isMobile && !currentChat ? "hidden" : "block"}`}>
        {currentChat ? (
          <>
            <ChatHeader
              currentChat={currentChat}
              onBack={isMobile ? handleBackToList : undefined}
              onVideoCall={startVideoCall}
              isMobile={isMobile}
              userType="doctor"
            />

            <MessagesContainer messages={messages} currentUserId={doctorId || ""} _userType="doctor" />

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
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start messaging</div>
        )}
      </div>

      {incomingCall && (
        <IncomingCallModal
          callerName={currentChat?.userId.fullName || "Unknown User"}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {isVideoCallActive && currentChat && doctorId && (
        <VideoCall
          chatId={currentChat._id}
          userId={doctorId}
          otherUserName={currentChat.userId.fullName}
          onClose={() => setIsVideoCallActive(false)}
        />
      )}
    </div>
  )
}

export default DoctorChat
