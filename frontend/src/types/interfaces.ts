// Practitioner Interface
export interface IPractitioner {
  _id: string;
  registerNumber: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  profilePicture: string;
  isBlocked: boolean;
  isApproved: boolean;
  isRejected: boolean;
  specialization: string;
  qualification: string;
  fee: number;
  gender: string;
  experience: string;
  modesOfConsultation: string[];
  gallery: string[];
  documents: string[],
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  } | null;
  locationName: string,
  addressLine: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface Prescription {
  _id?: string
  patientName: string
  age: string
  diagnosis: string
  medications: Medication[]
  advice: string
  followUpDate: string
}

export interface PrescriptionFormProps {
  appointmentId: string
  patientName: any
  age: any
  existingPrescription: Prescription | null
  onClose: () => void
}



// Pagination Props Interface
export interface IPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Search Parameters Interface (Optional for APIs)
export interface ISearchParams {
    search: string;
    page: number;
    size: number;
}
// Interface for form data structure
export interface IUser {
    _id: string;
    email: string;
    fullName: string;
    gender: string;
    age: string;
    mobileNumber: string;
    pincode: string;
    addressline: string;
    city: string;
    state: string;
    profilePicture?: string; 
    isBlocked: boolean;
}



export interface IAppointment {
  _id: string;
  doctorId: string;
  userId: any;
  date: Date;
  slotId: string;
  timeSlotId: string;
  time: string;
  modeOfVisit: "Video" | "Clinic";
  amount: number;
  paymentId: string;
  isPaid?: boolean;
  isCancelled?: boolean;
  refundAmount?: number;
  videoCallEnabled?: boolean;
  chatEnabled?: boolean;
  isCompleted?: boolean;
  rating?: number;
  reviewMessage?: string;
  videoCallId?: string;
  isReviewed: boolean
}

export interface IReview {
  _id: string
  userId: {
    _id: string,
    fullName: string
  }
  doctorId: string
  appointmentId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}


export interface DashboardChartsProps {
  appointmentData: ChartData;
  revenueData: ChartData;
}

export interface GenerateSlotsModalProps {
  showGenerateModal: boolean;
  setShowGenerateModal: (show: boolean) => void;
  repeat: string;
  setRepeat: (repeat: string) => void;
  duration: number | undefined;
  handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  durationError: string;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  dayTimeSettings: { [key: string]: { startTime: string; endTime: string } };
  handleTimeChange: (day: string, field: "startTime" | "endTime", value: string) => void;
  timeErrors: { [key: string]: string };
  handleGenerateSlots: () => void;
  daysOfWeek: string[];
}

export interface DoctorLocationProps {
  addressLine: string,
  locationCoordinates?: {
    latitude: number,
    longitude: number
  },
  locationName: string
}

export interface Chat {
  _id: string
  userId: {
    _id: string
    fullName: string
    profilePicture: string
  }
  doctorId: {
    _id: string
    fullName: string
    profilePicture: string
  }
  lastMessage: {
    text: string
  }
  createdAt: string
}

export interface UserChatProps {
  isOpen: boolean
  onClose: () => void
  initialDoctorId?: string
}

export interface Message {
  _id: string
  chatId: string
  senderId: string
  receiverId: string
  text: string
  imageUrl: string
  timestamp: string
  read: boolean
}

export interface MessageWithLoading extends Message {
  isLoading?: boolean
  tempId?: string
}


export interface StatCardProps {
  title: string
  value: string | number
  type: "patients" | "appointments" | "consultations" | "revenue"
}

export interface Slot {
  _id: string;
  time: string;
  status: string;
  isAvailable: boolean;
}

export interface AppointmentContainerProps {
  doctorId: string;
  modesOfConsultation: string[];
  fee: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

export interface DoctorRegisterPayload {
  email: string;
}

export interface DoctorVerifyPayload {
  fullName: string;
  email: string;
  mobileNumber: string;
  registerNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface UpdateDoctorProfilePayload {
  doctorId: string;
  currentPassword: string;
  password?: string;
  profilePicture?: string;
}

