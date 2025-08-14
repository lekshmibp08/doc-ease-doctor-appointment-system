import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import DoctorModel from "../models/doctorModel";
import { Doctor } from "../../../domain/entities/doctor";
import { mapToDoctorEntity } from "../mappers/doctorMapper";

export class DoctorRepository implements IDoctorRepository {
  async findByEmail(email: string): Promise<Doctor | null> {
    const doctorDoc = await DoctorModel.findOne({ email });
    return doctorDoc ? mapToDoctorEntity(doctorDoc) : null;
  }

  async create(doctor: Doctor): Promise<Doctor> {
    const doctorDoc = await DoctorModel.create(doctor);
    return mapToDoctorEntity(doctorDoc);
  }

  async getAllDoctors() {
    const docs = await DoctorModel.find({}, "-password");
    return docs.map(mapToDoctorEntity);
  }

  async getDoctorsWithPagination(
    skip: number,
    limit: number,
    query: Partial<Doctor>
  ) {
    const docs = await DoctorModel.find(query, "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return docs.map(mapToDoctorEntity);
  }

  async countDoctors(query: Partial<Doctor>) {
    return await DoctorModel.countDocuments(query); 
  }

  async getAllApprovedDoctors() {
    const docs = await DoctorModel.find({ isApproved: true }, "-password");
    return docs.map(mapToDoctorEntity);
  }
  async findDoctorById(id: string) {
    const doc = await DoctorModel.findById(id);
    return doc ? mapToDoctorEntity(doc) : null;
  }
  async updateDoctor(id: string, updates: any) {
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return updatedDoctor ? mapToDoctorEntity(updatedDoctor) : null;
  }
  async getDoctorsByCriteria(
    query: any,
    sortOptions: any,
    skip: number,
    limit: number
  ) {
    const doctors = await DoctorModel.find(query, "-password")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalDocs = await DoctorModel.countDocuments(query);

    return { doctors: doctors.map(mapToDoctorEntity), totalDocs };
  }
  async getAllSpecializations() {
    const specializations = await DoctorModel.distinct("specialization");
    return specializations;
  }
}
