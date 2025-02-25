import UserHeader from '../../components/UserHeader';
import UserChat from '../../components/UserChat';
import { useState } from 'react';

const UserChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)

  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <div className="flex flex-col h-screen bg-customBgLight">
      {/* Header */}
      <header className="sticky top-0 z-10">
        <UserHeader role="user" onToggleSidebar={toggleSidebar} />
      </header>

      {/* Main Content - Takes Full Remaining Height */}
      <main className="flex-grow bg-lightTeal p-4 overflow-auto">
        <UserChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default UserChatPage;
