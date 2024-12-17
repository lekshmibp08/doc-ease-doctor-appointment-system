import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const renderSubtitle = () => {
    if (location.pathname === '/doctor/login') {
      return <div className="text-sm mt-1">Connect and Manage Your Patients Here</div>;
    }
    if (location.pathname === '/user/login') {
      return (
        <div className="text-sm mt-1">
          Search for a <span className="font-semibold">DOCTOR</span> who suits your needs
        </div>
      );
    }
  };

  // Determine the signup path dynamically
  const determineSignupPath = () => {
    if (location.pathname === '/doctor/login') {
      return '/doctor/signup';
    }
    else {
      return '/user/signup';
    }
  };

  return (
    <header className="w-full bg-customTeal flex items-center justify-between p-4">
      <div>
        <div className="flex items-center space-x-2">
          <div className="text-5xl" style={{ fontFamily: "'Lobster', cursive" }}>
            DocEase
          </div>
          <i className="fas fa-stethoscope text-white text-4xl"></i>
        </div>
        {renderSubtitle()}
      </div>
      <Link to={determineSignupPath()}>
        <button className="bg-[#9fc7cf] text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition">
          Create An Account
        </button>
      </Link>
    </header>
  );
};

export default Header;
