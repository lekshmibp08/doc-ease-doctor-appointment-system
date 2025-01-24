import { useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import UserHeader from "../../components/UserHeader";
import DoctorChat from "../../components/DoctorChat";
import Footer from "../../components/Footer";


const DoctorChatPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col ">
      <UserHeader role="doctor" onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        <DoctorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-2">
          <DoctorChat/>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DoctorChatPage;











