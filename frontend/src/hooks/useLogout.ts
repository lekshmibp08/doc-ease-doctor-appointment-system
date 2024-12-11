import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuth } from '../Redux/slices/authSlice';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
        await axios.post('/api/doctors/logout', {},);
        dispatch(clearAuth());

        // Determine the base path (admin, doctor, or patient)
        const basePath = location.pathname.split('/')[1]; // Extract the first part of the path

        // Redirect based on the base path
        switch (basePath) {
          case 'admin':
            navigate('/admin/login', { replace: true });
            break;
          case 'doctors':
            navigate('/doctor/login', { replace: true });
            break;
          case 'user':
            navigate('/user/login', { replace: true });
            break;
          default:
            navigate('/'); // Fallback route
            break;
        }          
      } catch (error) {
        console.log(error);      
      }
  };

  return logout;
};

export default useLogout;
