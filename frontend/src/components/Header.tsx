import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-customTeal flex items-center justify-between p-4">
      <div>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">DocEase</div>
          <i className="fas fa-stethoscope text-white text-xl"></i>
        </div>
        <div className="text-sm mt-1">Connect and Manage Your Patients Here</div>
      </div>
      <Link to="/doctor/signup">
        <button className="bg-[#9fc7cf] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition">
          Create An Account
        </button>      
      </Link>
    </header>
  );
};

export default Header;
