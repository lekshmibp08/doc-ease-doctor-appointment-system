
export interface ListApprovedDoctorsDTO {
  _id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  isBlocked: boolean;
  profilePicture: string;
  isRejected: boolean;
  specialization: string;
  fee: number;
  gender: string;
  experience: number;
  locationCoordinates: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
}
