import { ListApprovedDoctorsDTO } from "../../../dtos/doctorDTO/doctorDTOs"; 

export function mapToListApprovedDoctorsDTO(doctor: any): ListApprovedDoctorsDTO {
  return {
    _id: doctor._id,
    fullName: doctor.fullName,
    email: doctor.email,
    isApproved: doctor.isApproved,
    isBlocked: doctor.isBlocked,
    profilePicture: doctor.profilePicture,
    isRejected: doctor.isRejected,
    specialization: doctor.specialization,
    fee: doctor.fee,
    gender: doctor.gender,
    experience: doctor.experience,
    locationCoordinates: {
      latitude: doctor.locationCoordinates?.latitude,
      longitude: doctor.locationCoordinates?.longitude,
    },
    locationName: doctor.locationName,
  };
}
