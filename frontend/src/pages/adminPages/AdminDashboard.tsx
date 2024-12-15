import { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
          
          <h2 className="text-2xl font-bold">Welcome to Admin Dashboard</h2>
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
