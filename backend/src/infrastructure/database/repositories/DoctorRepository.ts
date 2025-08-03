import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import DoctorModel from "../models/DoctorModel";
import { Doctor } from "../../../domain/entities/Doctor";

export class DoctorRepository implements IDoctorRepository {

  async findByEmail(email: string): Promise<Doctor | null> {
    const doctorDoc = await DoctorModel.findOne({ email });
    return doctorDoc
  }
  
  async create(doctor: Doctor): Promise<Doctor> {
    const doctorDoc = await DoctorModel.create(doctor);
    return doctorDoc
  }
  
  async getAllDoctors() {
    return await DoctorModel.find({}, "-password"); 
  }
  
  async getDoctorsWithPagination(skip: number, limit: number, query: Partial<Doctor>) {
    return await DoctorModel.find(query, "-password").skip(skip).limit(limit).sort({ createdAt: -1 }); 
  }
  
  async countDoctors(query: Partial<Doctor>) {
    return await DoctorModel.countDocuments(query); // Get total count of doctors
  }
  
  async getAllApprovedDoctors() {
    return await DoctorModel.find({ isApproved: true }, "-password");
  }
  async findDoctorById(id: string) {
    return await DoctorModel.findById(id);
  }
  async updateDoctor(id: string, updates: any) {
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, updates, { new: true});
    return updatedDoctor;
  }
  async getDoctorsByCriteria(query: any, sortOptions: any, skip: number, limit: number) {
    
    const doctors = await DoctorModel.find(query, "-password")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
  
    const totalDocs = await DoctorModel.countDocuments(query);
    
    return { doctors, totalDocs };
  }
  async getAllSpecializations() {
    const specializations = await DoctorModel.distinct('specialization');
    return specializations;
  }

}  




