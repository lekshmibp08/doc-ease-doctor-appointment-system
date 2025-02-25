import type React from "react"
import { useState } from "react"
import UserChat from "./UserChat"

interface ChatButtonProps {
  doctorId: string
}

const ChatButton: React.FC<ChatButtonProps> = ({ doctorId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleOpenChat = () => {
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  return (
    <>
      <button
        onClick={handleOpenChat}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Chat With Us
      </button>
      <UserChat isOpen={isChatOpen} onClose={handleCloseChat} initialDoctorId={doctorId} />
    </>
  )
}

export default ChatButton

