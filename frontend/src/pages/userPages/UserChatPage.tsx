import UserHeader from '../../components/UserHeader';
import UserChat from '../../components/UserChat';

const UserChatPage = () => {
  return (
    <div className="flex flex-col h-screen bg-customBgLight">
      {/* Header */}
      <header className="sticky top-0 z-10">
        <UserHeader role="user" />
      </header>

      {/* Main Content - Takes Full Remaining Height */}
      <main className="flex-grow bg-lightTeal p-4 overflow-auto">
        <UserChat />
      </main>
    </div>
  );
};

export default UserChatPage;
