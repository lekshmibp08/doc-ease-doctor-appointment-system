import { store } from "../Redux/store";
import { clearAdminToken } from "../Redux/slices/adminSlice";
import { clearUserToken } from "../Redux/slices/userSlice";
import { clearDoctorToken } from "../Redux/slices/doctorSlice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/axiosConfig";

// Standalone logout function
export const handleLogout = (basePath: any) => {
  switch (basePath) {
    case "admin":
      store.dispatch(clearAdminToken());
      window.location.href = "/admin/login"; // Replace with navigate if required
      break;
    case "doctor":
      store.dispatch(clearDoctorToken());
      window.location.href = "/doctor/login";
      break;
    case "user":
    default:
      store.dispatch(clearUserToken());
      window.location.href = "/user/login";
      break;
  }
};

// Hook version for components
export const useLogout = () => {
  const navigate = useNavigate();
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
