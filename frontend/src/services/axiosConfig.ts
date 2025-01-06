import axiosInstance from 'axios';
import { store } from '../Redux/store'; // Adjust the path to your Redux store
import { clearUserToken } from '../Redux/slices/userSlice';
import { clearAdminToken } from '../Redux/slices/adminSlice';
import { clearDoctorToken } from '../Redux/slices/doctorSlice';
import { useDispatch } from 'react-redux';

// Base Axios instance
const axios = axiosInstance.create({
  baseURL: 'http://localhost:5000', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Function to get the token from Redux state
const getTokenFromRedux = () => {
  const state = store.getState(); // Access the current Redux state
  console.log("state .........> ", state);
  
  const { userAuth, doctorAuth, adminAuth } = state;

  // Log state for debugging
  console.log('Redux State in Axios Interceptor:', state);

  // Retrieve the token based on role
  if (adminAuth?.token) return adminAuth.token;
  if (doctorAuth?.token) return doctorAuth.token;
  if (userAuth?.token) return userAuth.token;

  return null; // Return null if no token exists
};


const getTokenFromSessionStorage = (url: string | undefined): string | null => {
  // Check the URL to determine the token's role
  if (url?.includes('/api/admin')) {
    console.log("ADMIN");
    console.log(url);
    
    
    return sessionStorage.getItem('adminToken'); // Return Admin Token
  } else if (url?.includes('/api/doctors')) {
    console.log("DOCTOR");
    console.log(url);
    
    
    return sessionStorage.getItem('doctorToken'); // Return Doctor Token
  } else if (url?.includes('/api/users')) {
    console.log("USER");
    console.log(url);
    

    return sessionStorage.getItem('userToken'); // Return User Token
  }

  // No matching role
  console.warn('No matching token found for URL:', url);
  return null;
};


// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    console.log('Axios Interceptor Activated: Sending request with config:', config);

    // Check if the request is to Cloudinary
    if (config.url?.startsWith('https://api.cloudinary.com')) {
      console.log('Cloudinary request detected, skipping Authorization header.');
      return config; // Skip adding Authorization header
    }





    const token = getTokenFromSessionStorage(config.url);


    
    //const token = getTokenFromRedux(); // Get the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
      console.log('Authorization Header Set:', config.headers['Authorization']);
    } else {
      console.warn('No token found in Redux state');
    }

    return config; // Return the updated config
  },
  (error) => {
    console.error('Axios Request Interceptor Error:', error);
    return Promise.reject(error); // Forward the error
  }
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    // Handle errors (e.g., token expiration)
    if (error.response?.status === 401) {
      const dispatch = useDispatch();
      console.error('Unauthorized access! Clearing tokens and redirecting to login.');

      // Clear tokens for all roles
      dispatch(clearUserToken());
      dispatch(clearDoctorToken());
      dispatch(clearAdminToken());

      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error); // Forward the error
  }
);

export default axios;
