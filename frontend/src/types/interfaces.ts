// Practitioner Interface
export interface IPractitioner {
    _id: string;
    registerNumber: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    isBlocked: boolean;
    isApproved: boolean;
}

// User Interface
export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    isBlocked: boolean;
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
export interface IUserFormData {
    email: string;
    fullName: string;
    gender: string;
    age: string;
    mobile: string;
    pincode: string;
    addressLine1: string;
    city: string;
    state: string;
    profilePicture?: string; 
}

// Props for UserAccountDetails component
export interface IUserAccountDetailsProps {
    formData: IUserFormData;
    setImage: (file: File) => void;
    fileRef: React.RefObject<HTMLInputElement>;
    handleUpdateProfile: () => void;
}

// Props for UserProfileDetails component
export interface IUserProfileDetailsProps {
    formData: IUserFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleUpdateDetails: () => void;
}
  