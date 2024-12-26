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
    return await DoctorModel.find(query, "-password").skip(skip).limit(limit).sort({ createdAt: -1 }); 
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
  },
  getDoctorsByCriteria: async (criteria: {
    page: number;
    size: number;
    search?: string;
    location?: string;
    gender?: string;
    experience?: string;
    availability?: string;
    fee?: string;
    department?: string;
    sort?: string;
  }): Promise<{ doctors: any[]; totalPages: number }> => {
    const query: any = { isBlocked: false, isApproved: true };

    // Apply text search on fullName and specialization
    if (criteria.search) {
      query.$text = { $search: criteria.search };
    }

    // Apply filters
    if (criteria.location) query.location = criteria.location;
    if (criteria.gender) query.gender = criteria.gender;
    if (criteria.experience) query.experience = criteria.experience;
    if (criteria.availability) query.availability = criteria.availability;
    if (criteria.fee) query.fee = { $lte: criteria.fee };
    if (criteria.department) query.department = criteria.department;

    // Define sorting
    const sortOptions: any = {};
    if (criteria.sort === "experience") sortOptions.experience = -1;
    else if (criteria.sort === "fee") sortOptions.fee = 1;

    // Fetch doctors with pagination
    const doctors = await DoctorModel.find(query, "-password")
      .sort(sortOptions)
      .skip((criteria.page - 1) * criteria.size)
      .limit(criteria.size);

    // Get total count of documents matching the query
    const totalDocs = await DoctorModel.countDocuments(query);

    return {
      doctors,
      totalPages: Math.ceil(totalDocs / criteria.size),
    };
  },
  
});
