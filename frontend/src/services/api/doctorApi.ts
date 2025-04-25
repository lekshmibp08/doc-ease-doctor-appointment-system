import axios from "../axiosConfig";
import type { 
    LoginPayload, 
    ResetPasswordPayload,
    DoctorRegisterPayload,
    DoctorVerifyPayload,
} from '../../types/interfaces'


export const sendOtpToDoctor = async (payload: DoctorRegisterPayload) => {
  return await axios.post('/api/doctors/send-otp', payload);
};

export const verifyOtpAndRegisterDoctor = async (payload: DoctorVerifyPayload) => {
  return await axios.post('/api/doctors/verify-otp-and-register', payload);
};

export const doctorLogin = async (formData: LoginPayload) => {
  return await axios.post('/api/doctors/login', formData, { withCredentials: true });
};

export const sendDoctorOtp = async (email: string) => {
  return await axios.post('/api/doctors/forget-password/send-otp', { email });
};

export const resetDoctorPassword = async (data: ResetPasswordPayload) => {
  return await axios.patch('/api/doctors/forget-password/verify-and-reset', data);
};

export const uploadDoctorProfileImage = async (
  image: File,
  onUploadProgress: (percent: number) => void
): Promise<string | null> => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "DocEase");
  data.append("cloud_name", "dgpy8wkiw");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dgpy8wkiw/image/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percent);
          }
        },
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const updateDoctorProfile = async (
  doctorId: any,
  updatedData: any
): Promise<any> => {
  const response = await axios.patch(
    `/api/doctors/profile/update/${doctorId}`,
    updatedData
  );
  return response.data.updatedDocProfile;
};

export const uploadFileToCloudinary = async (
  apiUrl: string,
  formData: FormData,
  config: object
): Promise<string> => {
  const response = await axios.post(apiUrl, formData, config);
  return response.data.secure_url;
};

export const fetchLocationName = async (
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<any | null> => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;  
  const response = await axios.get(url);
  return response;
};

export const fetchDoctorSlots = async (
  doctorId: string,
  date: string,
  timePeriod: string
): Promise<{ slotDataFiltered: any[]; slotId: string }> => {
  const response = await axios.get("/api/doctors/slots", {
    params: {
      doctorId,
      date,
      timePeriod,
    },
  });

  return {
    slotDataFiltered: response.data.slotDataFiltered,
    slotId: response.data.slotId,
  };
};

export const generateDoctorSlots = async ({
  doctorId,
  startDate,
  repeat,
  availableDays,
  duration,
}: {
  doctorId: string;
  startDate: string;
  repeat: string;
  availableDays: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  duration: number;
}): Promise<{ message: string }> => {
  const response = await axios.post("/api/doctors/generate-slots", {
    doctorId,
    startDate,
    repeat,
    availableDays,
    duration,
  });

  return response.data;
};

export const updateSlotStatus = async (
  slotId: string,
  timeSlotId: string,
  status: string
): Promise<boolean> => {
  const response = await axios.put("/api/doctors/slots/update-status", {
    slotId,
    timeSlotId,
    status,
  });

  return response.data.updation;
};

export const sendMessagebyDoc = async (messageData: any) => {
  try {
    const response = await axios.post("/api/doctors/send-message", messageData);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; 
  }
};

export const fetchChatData = async (doctorId: string) => {
  try {
    const response = await axios.get("/api/doctors/get-chats", {
      params: { doctorId },
    });
    return response; 
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error; 
  }
};

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const response = await axios.get(`/api/doctors/get-messages`, {
      params: { chatId },
    });
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const uploadImageForSend = async (formData: FormData, cloudinaryUrl: string) => {
  const response = await axios.post(cloudinaryUrl, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const fetchAppointments = async (
  doctorId: string,
  page: number,
  date: string
) => {
  const response = await axios.get("/api/doctors/appointments", {
    params: {
      page,
      size: 8,
      date,
      doctorId,
    },
  });
  return response;
};

export const fetchPrescriptionByAppointmentId = async (appointmentId: string) => {
  const response = await axios.get(`/api/doctors/prescriptions/${appointmentId}`);
  return response;
};

export const completeAppointmentById = async (appointmentId: string) => {
  return await axios.put(`/api/doctors/appointments/${appointmentId}`, {
    isCompleted: true,
  });
};

export const updatePrescription = async (prescriptionId: any, prescription: any) => {
  return await axios.put(`/api/doctors/prescriptions/${prescriptionId}`, { prescription });
};

export const createPrescription = async (appointmentId: any, prescription: any) => {
  return await axios.post("/api/doctors/prescriptions", { appointmentId, prescription });
};

