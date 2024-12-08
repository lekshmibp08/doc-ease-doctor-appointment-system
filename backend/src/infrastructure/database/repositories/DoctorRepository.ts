import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import DoctorModel from "../models/DoctorModel";

export const createDoctorRepository = (): IDoctorRepository => ({
  findByEmail: async (email) => {
    const doctorDoc = await DoctorModel.findOne({ email });
    return doctorDoc
      ? {
          fullName: doctorDoc.fullName,
          email: doctorDoc.email,
          mobileNumber: doctorDoc.mobileNumber,
          password: doctorDoc.password,
          role: doctorDoc.role,
          registerNumber: doctorDoc.registerNumber,
          isApproved: doctorDoc.isApproved
        }
      : null;
  },
  create: async (doctor) => {
    const doctorDoc = await DoctorModel.create(doctor);
    return {
      fullName: doctorDoc.fullName,
      email: doctorDoc.email,
      mobileNumber: doctorDoc.mobileNumber,
      password: doctorDoc.password,
      role: doctorDoc.role,
      registerNumber: doctorDoc.registerNumber,
      isApproved: doctorDoc.isApproved
    };
  },
});
