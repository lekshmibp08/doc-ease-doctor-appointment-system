import type React from "react"
import { ArrowLeft } from "lucide-react"
import type { Chat } from "../../types/interfaces"
import { getFullImageUrl } from "../../utils/getFullImageUrl"

interface ChatHeaderProps {
  currentChat: Chat
  onBack?: () => void
  onVideoCall: () => void
  isMobile?: boolean
  userType: "doctor" | "user"
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ currentChat, onBack, onVideoCall, isMobile = false, userType }) => {
  const displayUser = userType === "doctor" ? currentChat.userId : currentChat.doctorId
  const displayName = displayUser?.fullName || "Unknown User"
  const profilePicture = displayUser?.profilePicture

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && onBack && (
          <button onClick={onBack} className="mr-2">
            <ArrowLeft className="h-6 w-6 text-blue-500 text-2xl" />
          </button>
        )}
        <img
          src={getFullImageUrl(profilePicture) || "/placeholder-user.jpg"}
          alt={displayName}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="font-bold text-lg">{displayName}</div>
      </div>
      <button onClick={onVideoCall} className="text-blue-500">
        <i className="fas fa-video text-3xl"></i>
      </button>
    </div>
  )
}

export default ChatHeader
