import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../../Redux/slices/authSlice'; 
import { useDispatch } from 'react-redux';

const AdminDashboard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();  
  
    const handleSignOut = async () => {
      try {
        await axios.post('/api/doctors/logout', {},);
        dispatch(clearAuth());
  
        navigate('/admin/login')
  
      } catch (error) {
        console.log(error);      
      }
    }

    return (<>
        <h1>ADMIN DASHBOARD</h1>
        <button
            onClick={handleSignOut}
            className="bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
    
    </>)
}

export default AdminDashboard
