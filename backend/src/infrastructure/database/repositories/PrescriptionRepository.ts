import { IPrescription } from "../../../domain/entities/Prescription" 
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository" 
import PrescriptionModel from "../models/PrescriptionModel"
import { Types } from "mongoose"

export class PrescriptionRepository implements IPrescriptionRepository {

  async create(prescription: any): Promise<IPrescription> {
    const { appointmentId, prescription: prescData } = prescription;
    const result = await PrescriptionModel.create({
      ...prescData,
      appointmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('====================================');
    console.log("create usecase result: ", result);
    console.log('====================================');
    return { ...prescription, id: result._id?.toString() }
    };

  async findByAppointmentId(appointmentId: string): Promise<IPrescription | null> {

    const result = await PrescriptionModel.findOne({ appointmentId })
    console.log('====================================');
    console.log("Fetch result : ", result);
    console.log('====================================');
    if (result) {
      return result.toObject()
    }
    return null
  }

async update(id: string, prescriptionData: Partial<IPrescription>): Promise<IPrescription | null> {
    const updateData = { ...prescriptionData, updatedAt: new Date() }; // Ensure `updatedAt` is updated
    
    const result = await PrescriptionModel.findOneAndUpdate(
        { _id: id },
        { $set: updateData }, // Directly set update fields
        { returnDocument: "after", new: true } // Ensure returning updated document
    );

    console.log('====================================');
    console.log("Updated Prescription: ", result);
    console.log('====================================');

    return result ? result.toObject() : null; // Convert Mongoose document to plain object
}



}

