import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Chat, Message } from "../types/interfaces"
import { useSelector } from "react-redux"
import type { RootState } from "@/Redux/store"
import io from "socket.io-client"
import { Check, ArrowLeft } from "lucide-react"
import VideoCall from "./VideoCall"
import { 
  sendMessagebyDoc,
  fetchChatData,
  getMessagesByChatId,
  uploadImageForSend
} from "../services/api/doctorApi"
import { getFullImageUrl } from "../utils/getFullImageUrl"


const ENDPOINT = import.meta.env.VITE_BASE_URL || "http://localhost:5000"
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API_URL

let socket: any

const DoctorChat: React.FC = () => {
  const doctorId = useSelector((state: RootState) => state.doctorAuth.currentUser?._id)
  const [messages, setMessages] = useState<Message[]>([])
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
        // Increment unread count for other chats
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
    if ((!newMessage.trim() && !imagePreview) || !currentChat) return

    const messageData = {
      chatId: currentChat._id,
      senderId: doctorId,
      receiverId: currentChat.userId._id,
      text: newMessage,
      imageUrl,
      timestamp: new Date().toISOString(),
      read: false,
    }

    try {
      const response = await sendMessagebyDoc(messageData)
      socket.emit("send message", messageData)
      setMessages((prevMessages) => [...prevMessages, response.data])
      setNewMessage("")
      setImagePreview(null)
      setImageUrl('')
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewURL = URL.createObjectURL(file)
    setImagePreview(previewURL)

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
        await sendMessage()
    } catch (error) {
      console.error("Error uploading image:", error)
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
    setIncomingCall(null); // Hide the incoming call modal
  };

  const handleReject = () => {
    setIncomingCall(null); // Hide the modal
    setIsVideoCallActive(false);

    socket.emit("reject call", {
      chatId: currentChat._id,
      receiverId: doctorId
    });
  };



  return (
    <div className="flex h-[580px] border rounded-lg overflow-hidden">
      {/* Chat List - Always Visible on Large Screens */}
      <div
        className={`w-full md:w-1/3 border-r border-gray-300 overflow-y-auto ${isMobile && currentChat ? "hidden" : "block"}`}
      >
        <div className="p-4 border-b font-bold text-xl">Chats</div>
        {allChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => selectChat(chat)}
            className={`cursor-pointer flex items-center p-2 hover:bg-gray-200 ${
              currentChat?._id === chat._id ? "bg-blue-100" : ""
            }`}
          >
            <img
              src={getFullImageUrl(chat.userId.profilePicture)}
              alt={chat.userId.fullName}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 ml-2">
              <div className="font-bold">{chat.userId.fullName}</div>
              <div className="text-sm text-gray-600 truncate">
                {chat.lastMessage?.text || "No messages yet"}
              </div>
            </div>
            {unreadCounts[chat._id] > 0 && (
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 
              flex items-center justify-center text-xs"
              >
                {unreadCounts[chat._id]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Content */}
      <div className={`flex-1 flex flex-col ${isMobile && !currentChat ? "hidden" : "block"}`}>
        {currentChat ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                {isMobile && (
                <button onClick={() => setCurrentChat(null)} className="text-blue-500 text-2xl mr-3">
                  <ArrowLeft className="h-6 w-6 text-blue-500 text-2xl" />
                </button>
                )} 
                <img
                  src={getFullImageUrl(currentChat.userId.profilePicture)}
                  alt={currentChat.userId.fullName}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="font-bold text-lg">
                  {currentChat.userId.fullName}
                </div>
              </div>
              {/* Video Camera Icon */}
              <button onClick={startVideoCall}
                className="text-blue-500"
              >
                <i className="fas fa-video text-3xl"></i>           
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
              {messages.map((msg, index) => (
                <div key={index} className={`flex mb-4 ${msg.senderId === doctorId ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg max-w-w[70%] ${msg.senderId === doctorId ?
                    "bg-blue-500 text-white" : "bg-white"}`}
                  >
                    {msg.text && <p className="break-words">{msg.text}</p>}
                    {msg.imageUrl && (
                      <div className="overflow-hidden rounded-lg mt-2 border
                       border-gray-300 w-[150px] h-[150px] md:w-[250px] md:h-[250px]"
                      >
                        <img src={getFullImageUrl(msg.imageUrl)} alt="Image"className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.senderId === doctorId && (
                        <Check className={`{h-4 w-4 ${msg.read ? "text-green-700" : "text-gray-300"}}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-300">
              {imagePreview && (
              <div className="mt-2 relative inline-block">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-w-xs h-auto rounded-lg border border-gray-300" />
                <button onClick={() => setImagePreview(null)} className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full">
                  ✕
                </button>
              </div>
              )}

              <div className="flex items-center space-x-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
                <input
                  id="image-upload" type="file"
                  accept="image/*" className="hidden"
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>

              </div>
            </div>
          </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
        )}
      </div>
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="mb-4">Incoming call from {currentChat?.userId.fullName}</p>
            <button onClick={handleAccept} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              Accept
            </button>
            <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded">
              Reject
            </button>
          </div>
        </div>
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
