import useLogout from '../hooks/useLogout';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';


interface AdminHeaderProps {
  toggleSidebar?: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {

  const token = useSelector((state: RootState) => state.adminAuth.token )

  const logout = useLogout();

  return (
    <div className="w-full bg-customTeal text-white py-4 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          
          <button onClick={toggleSidebar} className="md:hidden text-white text-2xl">
            <i className="fas fa-bars"></i> {/* Hamburger Menu */}
          </button>
          
          <div className="text-5xl flex items-center" style={{ fontFamily: "'Lobster', cursive" }}>
            <span>DocEase</span>
            <i className="fas fa-stethoscope text-white text-4xl ml-2"></i>
          </div>
        </div>
        { token ? (
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold hidden md:block">Admin Area</h1>
            <button className="text-white hover:opacity-80">
              <i className="fas fa-bell text-xl"></i>
            </button>
            <button className="text-white hover:opacity-80" onClick={logout}>
              <i className="fas fa-sign-out-alt text-xl"></i>
            </button>          
          </div>
        ) : (
        <div className="flex flex-col items-center space-x-6">
          <h1 className="text-2xl font-bold hidden md:block">Admin Area</h1>
          <p className="text-sm font-bold mt-1">Control Your Client From Here</p>         
        </div>

        )
        }
      </div>
    </div>
  );
};

export default AdminHeader;
