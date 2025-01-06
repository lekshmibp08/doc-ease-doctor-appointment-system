import { NavLink } from 'react-router-dom';

interface IDoctorSidebarProps {
    isOpen: boolean;
    toggleSidebar?: () => void; 
  }

const DoctorSidebar = ({ isOpen }: IDoctorSidebarProps) => {
  return (
    <aside
      className={`bg-customBgLight text-black font-bold w-64 
        min-h-screen p-6 fixed top-0 left-0 transform transition-transform 
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
          to="/chats"
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
        <NavLink
          to="/logout"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Log Out
        </NavLink>
      </nav>
    </aside>
  );
};

export default DoctorSidebar;
