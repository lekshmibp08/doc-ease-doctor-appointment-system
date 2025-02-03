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
    addressLine: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  

// User Interface
//export interface IUser {
//    _id: string;
//    fullName: string;
//    email: string;
//    mobileNumber: string;
//    isBlocked: boolean;
//}

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

// Props for UserAccountDetails component
//export interface IUserAccountDetailsProps {
//    formData: IUserFormData;
//    setImage: (file: File) => void;
//    fileRef: React.RefObject<HTMLInputElement>;
//    handleUpdateProfile: () => void;
//}

// Props for UserProfileDetails component
//export interface IUserProfileDetailsProps {
//    formData: IUserFormData;
//    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//    handleUpdateDetails: () => void;
//}

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
}