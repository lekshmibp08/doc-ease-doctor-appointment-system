import type React from "react"
import type { Chat } from "../../types/interfaces"
import { getFullImageUrl } from "../../utils/getFullImageUrl"

interface ChatListProps {
  chats: Chat[]
  currentChat: Chat | null
  unreadCounts: { [key: string]: number }
  onSelectChat: (chat: Chat) => void
  onClose?: () => void
  title?: string
  isMobile?: boolean
  showChatList?: boolean
  userType: "doctor" | "user" 
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChat,
  unreadCounts,
  onSelectChat,
  onClose,
  title = "Chats",
  isMobile = false,
  showChatList = true,
  userType,
}) => {
  return (
    <div
      className={`${isMobile ? "w-full" : "w-1/3"} ${
        userType === "user" ? "bg-gray-100" : ""
      } border-r border-gray-300 flex flex-col overflow-y-auto ${isMobile && !showChatList ? "hidden" : "block"}`}
    >
      <div className={`flex justify-between items-center p-4 border-b ${userType === "user" ? "border-gray-300" : ""}`}>
        <h2 className="font-bold text-xl">{title}</h2>
        {onClose && (
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
        )}
      </div>

      {userType === "user" && (
        <div className="p-4">
          <input type="text" placeholder="Search a chat" className="w-full p-2 border border-gray-300 rounded-lg" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const displayUser = userType === "doctor" ? chat.userId : chat.doctorId
          const displayName = displayUser?.fullName || "Unknown User"
          const profilePicture = displayUser?.profilePicture

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`${userType === "user" ? "p-4" : "p-2"} cursor-pointer flex items-center ${
                currentChat?._id === chat._id ? "bg-blue-100" : "hover:bg-gray-200"
              }`}
            >
              <img
                src={getFullImageUrl(profilePicture) || "/placeholder-user.jpg"}
                alt={displayName}
                className={`${userType === "user" ? "w-12 h-12 mr-4" : "w-12 h-12"} rounded-full ${
                  userType === "doctor" ? "mr-0" : ""
                }`}
              />
              <div className={`flex-1 ${userType === "doctor" ? "ml-2" : ""}`}>
                <div className="font-bold">{displayName}</div>
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
          )
        })}
      </div>
    </div>
  )
}

export default ChatList
