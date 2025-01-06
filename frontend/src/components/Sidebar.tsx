import { NavLink } from 'react-router-dom';

interface ISidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: ISidebarProps) => {
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
          to="/admin/dashboard"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/requests"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          New Requests
        </NavLink>
        <NavLink
          to="/admin/doctors"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Practitioners
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          User Management
        </NavLink>
        <NavLink
          to="/admin/appointments"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Appointments
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `py-2 px-4 rounded bg-white text-black ${
              isActive ? '!bg-customTeal text-white' : 'hover:bg-customTeal hover:text-white'
            }`
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
