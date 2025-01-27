import axios from "../services/axiosConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket: any, selectedChatCompare;


interface Message {
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
  };
  doctorId: {
    _id: string;
    fullName: string;
  };
  lastMessage: {
    text: string;
  };
  createdAt: string;
}

const DoctorChat = () => {
  const doctorId = useSelector((state: RootState) => state.doctorAuth.currentUser?._id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);


  // Connect to Socket.IO server
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", doctorId);
    socket.on("connection", () => {
      setSocketConnected(true);
    })

    socket.on("receive message", (newMessage: Message) => {
      if (newMessage.chatId === currentChat?._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Update messages in real-time        
      }
    });
  }, [doctorId]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("/api/doctors/get-chats", {
          params: { doctorId },
        });
        setAllChats(response.data)

      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [doctorId]);

  // Select a chat to start messaging
  const selectChat = async (chat: Chat) => {
    setLoadingChat(true);
    setCurrentChat(chat); 
    try {
      const response = await axios.get(`/api/doctors/get-messages`,
        { params: { chatId: chat._id } }
      );
      setMessages(response.data); 
      setLoadingChat(false);      
      
      socket.emit('join chat', currentChat?._id )
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send Message
  const sendMessage = async () => {
    if (!newMessage.trim()) return; 

    const messageData = {
      chatId: currentChat?._id,
      senderId: doctorId,
      receiverId: currentChat?.userId?._id,
      text: newMessage,
    };

    try {
      const response = await axios.post("/api/doctors/send-message", {
        chatId: currentChat?._id,
        senderId: doctorId,
        receiverId: currentChat?.userId,
        text: newMessage,
      });

      socket.emit("send message", messageData);

      const sentMessage = response.data;
      setMessages((prevMessages) => [...prevMessages, sentMessage]); 
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  
  return (
    <div className="flex h-[580px]">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-100 border-r border-gray-300 flex flex-col">
          <div className="font-bold text-xl ml-4 mt-4">
            Chats
          </div>        
          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search a chat"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
    
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
          {allChats && allChats.length > 0 ? (
            allChats.map((chat) => (
              <div key={chat._id}
                onClick={() => selectChat(chat) }
                className={`p-4 cursor-pointer ${currentChat?._id === chat._id ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <div className="font-bold">{chat.userId.fullName}</div>
                <div className="text-sm text-gray-600">
                  {chat.lastMessage ? chat.lastMessage.text : ""}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-600">No chats available</div>
          )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-yellow-200 to-orange-200">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-300">
                <div className="font-bold text-lg">{currentChat?.userId.fullName}</div>
              </div>
        
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-3/4 p-3 rounded-lg ${
                      msg.senderId === doctorId
                        ? "ml-80 bg-white text-black" 
                        : "mr-80 bg-green-200 text-black" 
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            
              {/* Chat Footer */}
              <div className="p-4 bg-white border-t border-gray-300">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full p-3 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-3 bg-blue-500 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Show a message when no chat is selected
            <div className="flex-1 flex items-center justify-center text-gray-600 text-lg font-semibold">
              Select a chat to start messaging
            </div>
          )}
        </div>
    </div>
  );
};

export default DoctorChat;
