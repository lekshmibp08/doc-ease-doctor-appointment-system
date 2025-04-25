import axios from "../axiosConfig";

export const adminLogin = async (formData: { email: string; password: string }) => {
  return await axios.post("/api/admin/login", formData, { withCredentials: true });
};

export const getPendingRequests = async (
  currentPage: number,
  search: string
) => {
  const response = await axios.get('/api/admin/doctors/pending', {
    params: {
      page: currentPage,
      size: 8,
      search: search || "",
    },
  });
  return response;
};

export const approveDoctorById = async (id: string) => {
  return await axios.patch(`/api/admin/doctors/approve/${id}`);
};

export const rejectDoctorById = async (id: string, reason: string) => {
  return await axios.patch(`/api/admin/doctors/reject/${id}`, { reason });
};

export const getAllDoctors = async (page: number, size: number, search: string = "") => {
  return await axios.get("/api/admin/doctors", {
    params: {
      page,
      size,
      search,
    },
  });
};

export const toggleDoctorBlockStatus = async (doctorId: string) => {
  return await axios.patch(`/api/admin/doctors/block/${doctorId}`);
};

export const getAllUsers = async (page: number, size: number, search: string) => {
  return await axios.get('/api/admin/users', {
    params: {
      page,
      size,
      search,
    },
  });
};

export const toggleUserBlock = async (id: string) => {
  return await axios.patch(`/api/admin/users/block/${id}`);
};

export const fetchAppointments = async (page: number, search: string) => {
  return await axios.get('/api/admin/appointments', {
    params: {
      page,
      size: 8,
      search: search || "",
    },
  });
};

export const getDashboardStats = async (startDate: Date, endDate: Date) => {
  return await axios.post("/api/admin/dashboard-stats", {
    startDate,
    endDate,
  });
};