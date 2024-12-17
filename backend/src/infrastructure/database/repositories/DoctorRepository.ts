// infrastructure/database/repositories/DoctorRepository.ts
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import DoctorModel from "../models/DoctorModel";

export const createDoctorRepository = (): IDoctorRepository => ({
  findByEmail: async (email) => {
    const doctorDoc = await DoctorModel.findOne({ email });
    return doctorDoc
  },

  create: async (doctor) => {
    const doctorDoc = await DoctorModel.create(doctor);
    return doctorDoc
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
