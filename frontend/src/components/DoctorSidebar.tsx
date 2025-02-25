import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

interface IDoctorSidebarProps {
    isOpen: boolean;
    toggleSidebar?: () => void; 
  }

const DoctorSidebar = ({ isOpen }: IDoctorSidebarProps) => {
  const logout = useLogout();
  return (
    <aside
      className={`bg-customBgLight text-black font-bold w-64 
         p-6 fixed top-0 left-0 transform transition-transform 
        duration-300 md:relative ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/doctor/dashboard"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/doctor/slot-management"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Slot Management
        </NavLink>
        <NavLink
          to="/doctor/chat"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Chats
        </NavLink>
        <NavLink
          to="/doctor/appointment-management"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Appointments
        </NavLink>
        <button
          onClick={logout}
          className="py-2 px-4 rounded text-left bg-white text-black hover:bg-customTeal hover:text-white"          
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
};

export default DoctorSidebar;
