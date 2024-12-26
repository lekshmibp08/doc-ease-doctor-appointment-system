import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAdminToken } from '../Redux/slices/adminSlice';
import { clearUserToken } from '../Redux/slices/userSlice';
import { clearDoctorToken } from '../Redux/slices/doctorSlice';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
        await axios.post('/api/auth/logout', {},);

        const basePath = location.pathname.split('/')[1]; 

        console.log("BASE PATH: ", basePath);
        

        switch (basePath) {
          case 'admin':
            dispatch(clearAdminToken());
            navigate('/admin/login', { replace: true });
            break;
          case 'doctor':
            console.log("ready to clear token");
            
            dispatch(clearDoctorToken());
            navigate('/doctor/login', { replace: true });
            break;
          case 'user':
            dispatch(clearUserToken());
            navigate('/user/login', { replace: true });
            break;
          default:
            dispatch(clearUserToken());
            navigate('/user/login', { replace: true });
            break;
        }          
      } catch (error) {
        console.log(error);      
      }
  };

  return logout;
};

export default useLogout;
