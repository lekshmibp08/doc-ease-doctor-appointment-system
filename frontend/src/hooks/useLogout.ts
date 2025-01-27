import { store } from "../Redux/store";
import { clearAdminToken } from "../Redux/slices/adminSlice";
import { clearUserToken } from "../Redux/slices/userSlice";
import { clearDoctorToken } from "../Redux/slices/doctorSlice";
import { useLocation } from "react-router-dom";
import axios from "../services/axiosConfig";

// Standalone logout function
export const handleLogout = (basePath: any) => {
  if (basePath === "admin") {
    store.dispatch(clearAdminToken());
    window.location.href = "/admin/login"; // Replace with navigate if required
  } else if (basePath === "doctor") {
    store.dispatch(clearDoctorToken());
    window.location.href = "/doctor/login";
  } else {
    // Default case for "user" or any other undefined base path
    store.dispatch(clearUserToken());
    window.location.href = "/user/login";
  }
};

// Hook version for components
export const useLogout = () => {
  const location = useLocation();

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      const basePath = location.pathname.split("/")[1];
      handleLogout(basePath);
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};
