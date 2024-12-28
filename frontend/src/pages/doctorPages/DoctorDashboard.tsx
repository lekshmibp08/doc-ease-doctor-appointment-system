import { useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import UserHeader from "../../components/UserHeader";
import Footer from "../../components/Footer";


const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <UserHeader role="doctor" onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <DoctorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 bg-white p-6">
          {/* Placeholder for main content */}
          <div className="h-full flex items-center justify-center text-gray-500">
            Content Goes Here
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
