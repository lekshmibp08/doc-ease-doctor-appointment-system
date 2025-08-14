export interface ListApprovedDoctorsCriteriaDTO {
  page: number;
  size: number;
  search?: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  gender?: string;
  experience?: string;
  availability?: string;
  fee?: string;
  department?: string;
  sort?: string;
}

export interface VerifyOtpAndRegisterDTO {
  email: string;
  otp: string;
  fullName: string;
  mobileNumber: string;
  password: string;
}

export interface VerifyOtpAndResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}
