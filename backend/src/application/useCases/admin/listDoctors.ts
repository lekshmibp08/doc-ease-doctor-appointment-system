import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const listDoctors = async (doctorRepository: IDoctorRepository) => {
  const doctors = await doctorRepository.getAllDoctors();
  return doctors.map((doctor) => ({
    fullName: doctor.fullName,
    email: doctor.email,
    mobileNumber: doctor.mobileNumber,
    registerNumber: doctor.registerNumber,
    isApproved: doctor.isApproved,
    isBlocked: doctor.isBlocked,
  }));
};
