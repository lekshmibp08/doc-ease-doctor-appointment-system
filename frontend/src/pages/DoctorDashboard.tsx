import React from 'react'
import axios from 'axios';
import { RootState } from '../Redux/store';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '../Redux/slices/authSlice';


const DoctorDashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, role } = useSelector((state: RootState) => state.auth);

  const handleSignOut = async () => {
    try {
      await axios.post('/api/doctors/logout', {},);
      dispatch(clearAuth());

      navigate('/doctor/login')

    } catch (error) {
      console.log(error);      
    }
  }

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Token: {token}</p>
      <p>Role: {role}</p>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default DoctorDashboard
