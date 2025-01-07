import axiosInstance from 'axios';
import { store } from '../Redux/store';
import { refreshUserToken, clearUserToken } from "../Redux/slices/userSlice";
import { refreshAdminToken, clearAdminToken } from '../Redux/slices/adminSlice';
import { refreshDoctorToken, clearDoctorToken } from '../Redux/slices/doctorSlice';
import { useDispatch } from 'react-redux';


// Base Axios instance
const axios = axiosInstance.create({
  baseURL: 'http://localhost:5000', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});




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



// Function to determine the refresh token endpoint and Redux actions based on the URL
const getRefreshTokenConfig = (url: string) => {
  if (url.includes("/api/users")) {
    console.log("USER ROUTE FOUND");
    
    return {
      refreshEndpoint: "/api/users/refresh-token",
      refreshAction: refreshUserToken,
      clearAction: clearUserToken,
      tokenStorageKey: "userToken",
      role: 'user',
    };
  } else if (url.includes("/api/doctors")) {
    console.log("DDOCTOR ROUTE FOUND");

    return {
      refreshEndpoint: "/api/doctors/refresh-token",
      refreshAction: refreshDoctorToken,
      clearAction: clearDoctorToken,
      tokenStorageKey: "doctorToken",
      role: 'doctor',
    };
  } else if (url.includes("/api/admin")) {
    console.log("ADMIN ROUTE FOUND");

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
    console.log('Axios Interceptor Activated: Sending request with config:', config);

    // Check if the request is to Cloudinary
    if (config.url?.startsWith('https://api.cloudinary.com')) {
      console.log('Cloudinary request detected, skipping Authorization header.');
      return config; // Skip adding Authorization header
    }


    const token = getTokenFromSessionStorage(config.url);

    //const token = sessionStorage.getItem(config.url?.includes("/api/users")
    //  ? "userToken"
    //  : config.url?.includes("/api/doctors")
    //  ? "doctorToken"
    //  : "adminToken");

      console.log("ITS A ", token);

      

    
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
// axios.interceptors.response.use(
//   (response) => response, // Pass successful responses
//   (error) => {
//     // Handle errors (e.g., token expiration)
//     if (error.response?.status === 401) {
//       const dispatch = useDispatch();
//       console.error('Unauthorized access! Clearing tokens and redirecting to login.');
// 
//       // Clear tokens for all roles
//       dispatch(clearUserToken());
//       dispatch(clearDoctorToken());
//       dispatch(clearAdminToken());
// 
//       // Redirect to login page
//       window.location.href = '/login';
//     }
//     return Promise.reject(error); // Forward the error
//   }
// );


// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Access token expired. Attempting to refresh...");

      // Prevent multiple retries
      originalRequest._retry = true;

      // Determine the role-specific refresh token endpoint and actions
      const refreshConfig = getRefreshTokenConfig(originalRequest.url);

      if (!refreshConfig) {
        console.error("Unknown role. Unable to refresh token.");
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(refreshConfig.refreshEndpoint, {
          role: refreshConfig.role,
        }, { withCredentials: true });

        const newAccessToken = data.token;
        console.log("NEW ACCESS TOKEN: ", newAccessToken);
        

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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axios;
