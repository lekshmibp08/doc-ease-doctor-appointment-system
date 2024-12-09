import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-teal-700 text-white w-64 min-h-screen p-6">
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `py-2 px-4 rounded ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `py-2 px-4 rounded ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'}`
          }
        >
          Appointments
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `py-2 px-4 rounded ${isActive ? 'bg-teal-500' : 'hover:bg-teal-600'}`
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
