import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OAuth from '../components/OAuth';
import { setAuth, clearAuth } from '../Redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

const DoctorLoginPage = () => {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const token = useSelector((state: RootState) => state.auth.token )

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/doctor/dashboard', { replace: true });
    }
  }, [token, navigate]); // Runs whenever the token or navigate changes


  const handleChange = (e: any) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    
    try {
      dispatch(clearAuth());
      const response = await axios.post('/api/doctors/login', formData);

      const { docToken: token, role } = response.data;

      dispatch(setAuth({ token, role }));

      console.log('Login Successful:', response);
      navigate('/doctor/dashboard', { replace: true });

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const backendMessage = error.response.data?.message || 'Something went wrong!';
        setError(backendMessage)
        console.error('backendMessage:', backendMessage);
      } else {
        console.error('Error:', error.message || 'Network Error');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-white">
      <Header />
      <main
        className="flex-1 flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/public/background-1.png')" }}
      >
      
        <div className="max-w-sm w-full bg-customTeal bg-opacity-50 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">Doctor's Login</h3>

          {error && <div className="text-red-600 text-lg mb-4 text-center">{error}</div>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500 text-customTeal"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500 text-customTeal"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-right">
              <a href="#" className="text-red-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded transition"
            >
              Login
            </button>
            <OAuth/>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorLoginPage;
