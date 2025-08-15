import dotenv from 'dotenv'
import { ListApprovedDoctorsDTO } from "../../../dtos/doctorDTO/doctorDTOs"; 

dotenv.config();

const COMMON_STORAGE_URL = process.env.COMMON_STORAGE_URL;
const GOOGLE_IMAGE_BASE_URL = process.env.GOOGLE_IMAGE_BASE_URL;


export function mapToListApprovedDoctorsDTO(doctor: any): ListApprovedDoctorsDTO {
  let profilePicture = doctor.profilePicture;

  if (profilePicture?.startsWith(COMMON_STORAGE_URL)) {
    profilePicture = `cl:${profilePicture.replace(COMMON_STORAGE_URL, "")}`;
  } else if (profilePicture?.startsWith(GOOGLE_IMAGE_BASE_URL)) {
    profilePicture = `go:${profilePicture.replace(GOOGLE_IMAGE_BASE_URL, "")}`;
  } else {
    profilePicture;
  }
  return {
    _id: doctor._id,
    fullName: doctor.fullName,
    email: doctor.email,
    isApproved: doctor.isApproved,
    isBlocked: doctor.isBlocked,
    profilePicture,
    isRejected: doctor.isRejected,
    specialization: doctor.specialization
    
  };
}
