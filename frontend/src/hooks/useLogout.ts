import { store } from "../Redux/store";
import { clearAdminToken } from "../Redux/slices/adminSlice";
import { clearUserToken } from "../Redux/slices/userSlice";
import { clearDoctorToken } from "../Redux/slices/doctorSlice";
import { useLocation } from "react-router-dom";
import axios from "../services/axiosConfig";

// Standalone logout function
export const handleLogout = async (basePath: any) => {
  if (basePath === "admin") {
    await axios.post("/api/admin/logout", { role: "admin" }, { withCredentials: true });
    store.dispatch(clearAdminToken());
    window.location.href = "/admin/login"; 
  } else if (basePath === "doctor") {
    await axios.post("/api/doctors/logout", { role: "doctor" }, { withCredentials: true });
    store.dispatch(clearDoctorToken());
    window.location.href = "/doctor/login";
  } else {
    await axios.post("/api/users/logout", { role: "user" }, { withCredentials: true });
    store.dispatch(clearUserToken());
    window.location.href = "/user/login";
  }
};

// Hook version for components
export const useLogout = () => {
  const location = useLocation();

  const logout = async () => {
    try {
      const basePath = location.pathname.split("/")[1];
      handleLogout(basePath);
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};
