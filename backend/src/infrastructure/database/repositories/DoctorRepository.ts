// infrastructure/database/repositories/DoctorRepository.ts
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
          isApproved: doctorDoc.isApproved,
          isBlocked: doctorDoc.isBlocked,
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
      isApproved: doctorDoc.isApproved,
      isBlocked: doctorDoc.isBlocked,
    };
  },

  getAllDoctors: async () => {
    return await DoctorModel.find({}, "-password"); 
  },

  getDoctorsWithPagination: async (skip: number, limit: number, query: any) => {
    return await DoctorModel.find(query, "-password").skip(skip).limit(limit); 
  },

  countDoctors: async (query: any) => {
    return await DoctorModel.countDocuments(query); // Get total count of doctors
  },

  getAllApprovedDoctors: async () => {
    return await DoctorModel.find({ isApproved: true }, "-password");
  },
  findDoctorById: async (id) => {
    return await DoctorModel.findById(id);
  },
  updateDoctor: async (id, updates) => {
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, updates, { new: true});
    return updatedDoctor;
  }
  
});
