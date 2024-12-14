import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Footer from '../../components/Footer';
import AdminHeader from '../../components/AdminHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { useNavigate } from 'react-router-dom';
import { setAuth, clearAuth } from '../../Redux/slices/authSlice';
import { setAdminToken, clearAdminToken } from '../../Redux/slices/adminSlice';

const AdminLogin = () => {

    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
  
    const token = useSelector((state: RootState) => state.adminAuth.token )
  
    const dispatch = useDispatch();
    const navigate = useNavigate()
  
    useEffect(() => {
      if (token) {
        navigate('/admin/dashboard', { replace: true });
      }
    }, [token, navigate]); // Runs whenever the token or navigate changes
  
  
    const handleChange = (e: any) => {
      setFormData({...formData, [e.target.id]: e.target.value})
    }
  
    const handleLogin = async (e: any) => {
      e.preventDefault();
      setError('');
      
      try {
        dispatch(clearAdminToken());
        const response = await axios.post('/api/admin/login', formData);
  
        const { adminToken: token } = response.data;

        const {fullName} = jwtDecode<any>(token);
        
        dispatch(setAdminToken({token, currentUser: fullName}));
        
        console.log('Admin Login Successful:', response);
        
        navigate('/admin/dashboard', { replace: true });
  
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          const backendMessage = error.response.data?.message || 'Something went wrong!';
          setError(backendMessage)
          console.error('backendMessage:', backendMessage);
        } else {
          setError(error.message || 'Network Error');
          console.error('Error:', error.message || 'Network Error');
        }
      }
    };
  


  return (
    <div className="min-h-screen flex flex-col items-center bg-customBgLight">
      {/* Header Section */}
      
      <AdminHeader/>

      {/* Login Form Section */}
      <div className="flex-grow flex items-center justify-center py-12 w-full px-4">
        <div className="bg-grey-200 rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

          {error && <div className="text-red-600 text-lg mb-4 text-center">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                onChange={handleChange}
                type="email"
                id="email"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                onChange={handleChange}
                type="password"
                id="password"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="mb-6 text-right">
              <a href="#" className="text-teal-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <Footer/>
    </div>
  );
};

export default AdminLogin;
