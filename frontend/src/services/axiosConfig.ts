import axiosInstance from 'axios';
import { store } from '../Redux/store';
import { refreshUserToken, clearUserToken } from "../Redux/slices/userSlice";
import { refreshAdminToken, clearAdminToken } from '../Redux/slices/adminSlice';
import { refreshDoctorToken, clearDoctorToken } from '../Redux/slices/doctorSlice';
import {handleLogout} from '../hooks/useLogout';
import Swal from 'sweetalert2';
const BASE_URL = import.meta.env.VITE_BASE_URL


// Base Axios instance
const axios = axiosInstance.create({
  baseURL: BASE_URL, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const getTokenFromSessionStorage = (url: string | undefined): string | null => {
  const state = store.getState();
  // Check the URL to determine the token's role
  if (url?.includes('/api/admin')) {
    
    return state.adminAuth.token;
  } else if (url?.includes('/api/doctors')) {
    
    return state.doctorAuth.token;
  } else if (url?.includes('/api/users')) {
    
    return state.userAuth.token;
  }

  // No matching role
  return null;
};



// Function to determine the refresh token endpoint and Redux actions based on the URL
const getRefreshTokenConfig = (url: string) => {
  if (url.includes("/api/users")) {
    
    return {
      refreshEndpoint: "/api/users/refresh-token",
      refreshAction: refreshUserToken,
      clearAction: clearUserToken,
      tokenStorageKey: "userToken",
      role: 'user',
    };
  } else if (url.includes("/api/doctors")) {

    return {
      refreshEndpoint: "/api/doctors/refresh-token",
      refreshAction: refreshDoctorToken,
      clearAction: clearDoctorToken,
      tokenStorageKey: "doctorToken",
      role: 'doctor',
    };
  } else if (url.includes("/api/admin")) {

    return {
      refreshEndpoint: "/api/admin/refresh-token",
      refreshAction: refreshAdminToken,
      clearAction: clearAdminToken,
      tokenStorageKey: "adminToken",
      role: 'admin',
    };
  }
  return null; // Unknown role
};



// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    // Check if the request is to Cloudinary
    if (config.url?.startsWith('https://api.cloudinary.com')) {
      return config; // Skip adding Authorization header
    }

    const token = getTokenFromSessionStorage(config.url);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
    } else {
      console.warn('No token found in Redux state');
    }

    return config; // Return the updated config
  },
  (error) => {
    return Promise.reject(error); // Forward the error
  }
);


// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;
    

    if (error.response?.status === 401 && !originalRequest._retry) {

      // Prevent multiple retries
      originalRequest._retry = true;

      const errorMessage = error.response?.data?.message;

      if (errorMessage === "Invalid or expired token") {

        // Determine the role-specific refresh token endpoint and actions
        const refreshConfig = getRefreshTokenConfig(originalRequest.url);
        
        if (!refreshConfig) {
          console.error("Unknown role. Unable to refresh token.");
          return Promise.reject(error);
        }
        try {
          
          const { data } = await axiosInstance.post(refreshConfig.refreshEndpoint, {
            role: refreshConfig.role,
          }, { withCredentials: true, baseURL: BASE_URL, });

          const newAccessToken = data.token;          
          console.log('====================================');
          console.log(newAccessToken);
          console.log('====================================');
  
  
          // Update Redux and sessionStorage with the new token
          store.dispatch(refreshConfig.refreshAction(newAccessToken));
          sessionStorage.setItem(refreshConfig.tokenStorageKey, newAccessToken);
  
          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
  
          // Clear tokens and log out
          store.dispatch(refreshConfig.clearAction());
          sessionStorage.removeItem(refreshConfig.tokenStorageKey);
          window.location.href = "/user/login";
          return Promise.reject(refreshError);
        }
      } else {

        Swal.fire({
          icon: 'error', 
          title: 'Access Denied',
          text: error.response.data.message, 
          confirmButtonText: 'OK',
        });
      }

    }

    if(error.response?.status === 403) {
      
      Swal.fire({
        icon: 'error', 
        title: 'Access Denied',
        text: error.response.data.message, 
        confirmButtonText: 'OK',
      });

      try {
        const basePath = window.location.pathname.split("/")[1]; // Derive the base path
        Swal.fire({
          icon: 'error', 
          title: 'Error',
          text: error.response.data.message, 
          confirmButtonText: 'OK',
        });
        handleLogout(basePath);
      } catch (logoutError) {
        console.error("Error during logout after 403:", logoutError);
      }
    }

    return Promise.reject(error);
  }
);


export default axios;
