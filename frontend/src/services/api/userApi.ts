import axios from "../axiosConfig";
import { IPractitioner } from '../../types/interfaces'
import type { 
    IReview,
    IAppointment,
    Prescription, 
    Slot,

 } from '../../types/interfaces'
interface UpdateProfilePayload {
  userId: string;
  currentPassword: string;
  password?: string;
  profilePicture?: string;
}


export const sendOtpToEmail = async (email: string) => {
  return axios.post('/api/users/send-otp', { email });
};

export const verifyOtpAndRegister = async (formData: any) => {
  return axios.post('/api/users/verify-otp-and-register', formData);
};

export const loginUser = async (formData: any) => {
  return axios.post('/api/users/login', formData, { withCredentials: true });
};

export const sendForgotPasswordOtp = async (email: string) => {
  return axios.post('/api/users/forget-password/send-otp', { email });
};

export const verifyOtpAndResetPassword = async (data: {
  email: string;
  newPassword: string;
  otp: string;
}) => {
  return axios.patch('/api/users/forget-password/verify-and-reset', data);
};

export const fetchUserChats = (userId: string) => {
  return axios.get("/api/users/get-chats", { params: { userId } })
}

export const createUserChat = (doctorId: string, userId: any) => {
  return axios.post("/api/users/chat", { doctorId, userId })
}

export const fetchChatMessages = (chatId: string) => {
  return axios.get("/api/users/get-messages", { params: { chatId } })
}

export const sendMessageToDoctor = (messageData: any) => {
  return axios.post("/api/users/send-message", messageData)
}

export const uploadToCloudinary = (formData: FormData, cloudinaryUrl: string) => {
  return axios.post(cloudinaryUrl, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const { userId, ...updatedData } = payload;

  const response = await axios.patch(
    `/api/users/profile/update/${userId}`,
    updatedData
  );

  return response.data;
};

export const updateUserProfileDetails = async (userId: any, updatedData: any) => {
  try {
    const res = await axios.patch(`/api/users/profile/update/${userId}`, updatedData);
    return res.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Something went wrong during profile update." };
  }
};

export const getDoctorSpecializations = async (): Promise<string[]> => {
  try {
    const response = await axios.get("/api/users/doctors/specializations");
    return response.data.specializations.filter(
      (specialization: string) => specialization.trim() !== ""
    );
  } catch (error) {
    throw error;
  }
};

export const getDoctors = async (params: {
  page: number;
  size: number;
  search?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  gender?: string;
  experience?: string;
  fees?: string;
  department?: string;
  sort?: string;
}): Promise<{ doctors: IPractitioner[]; totalPages: number }> => {
  try {
    const response = await axios.get("/api/users/doctors", { params });
    return {
      doctors: response.data.doctors,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchDoctorReviews = async (doctorId: string) => {
  try {
    const response = await axios.get(`/api/users/reviews/${doctorId}`);
    const reviews = response.data.reviews;

    return reviews
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getDoctorReviews = async (doctorId: string): Promise<IReview[]> => {
  try {
    const response = await axios.get(`/api/users/reviews/${doctorId}`);
    return response.data.reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getUserAppointments = async (userId: any): Promise<IAppointment[]> => {
  const response = await axios.get(`/api/users/appointments/${userId}`);
  return response.data.appointments;
};

export const cancelAppointment = async (appointmentId: string) => {
  const response = await axios.put(`/api/users/appointments/${appointmentId}`);
  return response.data;
};

export const getPrescription = async (
  appointmentId: string
): Promise<{ prescription: Prescription; doctor: IPractitioner }> => {
  const response = await axios.get(`/api/users/prescriptions/${appointmentId}`)
  return response.data
}

export const getReviewByAppointment = async (appointmentId: string) => {
  const response = await axios.get('/api/users/reviews', {
    params: { appointmentId },
  })
  return response.data.review[0] 
}

export const submitReview = async (payload: {
  appointmentId: string
  userId: string
  doctorId: string
  rating: number
  comment: string
}) => {
  return axios.post('/api/users/reviews', payload)
}

export const updateReview = async (reviewId: string, payload: {
  rating: number
  comment: string
}) => {
  return axios.put(`/api/users/reviews/${reviewId}`, payload)
}

export const fetchDoctorSlots = async (doctorId: any, date: any): Promise<{ timeSlots: any; slotId: any }> => {
  const response = await axios.get(`/api/users/slots/${doctorId}`, {
    params: { date },
  })
  return {
    timeSlots: response.data.timeSlots || [],
    slotId: response.data.slotId,
  }
}

export const fetchDoctorModes = async (doctorId: any): Promise<string[]> => {
  const response = await axios.get(`/api/users/doctor/${doctorId}`)
  return response.data.modesOfConsultation || []
}

export const rescheduleAppointment = async (payload: {
  appointmentId: string
  date: Date
  slotId: string
  selectedSlot: Slot
  timeSlotId: string
  time: string
  modeOfVisit: string
}): Promise<{ updatedAppointment: IAppointment }> => {
  const response = await axios.put('/api/users/reschedule-appointment', payload)
  return response.data
}

export const getDoctorDetails = async (doctorId: any) => {
  const response = await axios.get(`/api/users/doctor/${doctorId}`);
  return response.data as IPractitioner;
};

export const getDoctorSlots = async (doctorId: any, date: string) => {
  const response = await axios.get(`/api/users/slots/${doctorId}`, {
    params: { date }
  });
  return response.data;
};

export const createOrder = async (amount: number) => {
  const response = await axios.post('/api/users/create-order', { amount });
  return response.data;
};

export const bookAppointment = async (appointmentData: any) => {
  const response = await axios.post('/api/users/book-appointment', appointmentData);
  return response.data;
};