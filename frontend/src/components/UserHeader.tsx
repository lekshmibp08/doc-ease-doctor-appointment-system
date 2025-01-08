import { Menu, MenuItem, MenuItems } from '@headlessui/react';
import { useLogout } from '../hooks/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { useNavigate } from 'react-router-dom';

interface UserHeaderProps {
  role: 'user' | 'doctor'; // Add a role prop to differentiate between user and doctor
  onToggleSidebar?: () => void; // Optional callback for toggling the sidebar
}

const UserHeader: React.FC<UserHeaderProps> = ({ role, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { token, currentUser } = useSelector((state: RootState) =>
    role === 'user' ? state.userAuth : state.doctorAuth
  );

  const logout = useLogout();

  return (
    <header className="bg-customTeal text-white px-4">
      <div className="flex flex-wrap items-center justify-between gap-4 px-10">
        {/* Left Section: Logo and Tagline */}
        <div className="bg-customTeal text-white flex flex-col items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <h1
              className="text-4xl"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              DocEase
            </h1>
            <i className="fas fa-stethoscope text-white text-4xl ml-2"></i>
          </div>

          {/* Tagline */}
          <p className="text-sm mt-2 font-semibold">
            {role === 'user'
              ? 'Search for a DOCTOR who suits your needs'
              : 'Connect and Manage Your Patients Here'}
          </p>
        </div>

        {/* Right Section: User Info or Login/Register */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Hamburger Menu for Doctor */}
          {role === 'doctor' && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-white text-2xl md:hidden mr-4"
            >
              <i className="fas fa-bars"></i> {/* Hamburger Icon */}
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-4 relative">
              {/* User avatar */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center bg-white text-teal-700 rounded-full h-10 w-10 cursor-pointer">
                  {currentUser?.profilePicture && (
                    <img
                      src={currentUser?.profilePicture}
                      alt="profile"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </Menu.Button>

                {/* Dropdown Menu */}
                <MenuItems className="absolute top-12 right-0 bg-white text-teal-700 rounded shadow-md z-10">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-teal-100' : ''
                        } block w-full px-4 py-2 text-left cursor-pointer`}
                        onClick={() =>
                          navigate(
                            role === 'user' ? '/profile' : '/doctor/profile'
                          )
                        }
                      >
                        Profile
                      </button>
                    )}
                  </MenuItem>

                  {/* Conditional Appointments Menu */}
                  {role === 'user' && (
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-teal-100' : ''
                          } block w-full px-4 py-2 text-left cursor-pointer`}
                          onClick={() => navigate('/appointments')}
                        >
                          Appointments
                        </button>
                      )}
                    </MenuItem>
                  )}

                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-teal-100' : ''
                        } block w-full px-4 py-2 text-left cursor-pointer`}
                        onClick={logout}
                      >
                        SignOut
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>

              {/* Greeting */}
              <span className="font-semibold whitespace-nowrap">
                Hi {currentUser?.fullName}
              </span>
              {/* Notification (bell) icon */}
              <button className="text-white hover:opacity-80">
                <i className="fas fa-bell text-xl"></i>
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                navigate(role === 'user' ? '/user/login' : '/doctor/login')
              }
              className="bg-[#9fc7cf] text-teal-700 px-4 py-2 rounded-md hover:bg-teal-200 transition whitespace-nowrap"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
