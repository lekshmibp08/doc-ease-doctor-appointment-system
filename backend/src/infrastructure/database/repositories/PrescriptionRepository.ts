import { IPrescription } from "../../../domain/entities/prescription";
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import PrescriptionModel from "../models/prescriptionModel";
import { Types } from "mongoose";

export class PrescriptionRepository implements IPrescriptionRepository {
  async create(prescription: any): Promise<IPrescription> {
    const { appointmentId, prescription: prescData } = prescription;
    const result = await PrescriptionModel.create({
      ...prescData,
      appointmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { ...prescription, id: result._id?.toString() };
  }

  async findByAppointmentId(
    appointmentId: string
  ): Promise<IPrescription | null> {
    const result = await PrescriptionModel.findOne({ appointmentId }).lean();
    return result;
  }

  async update(
    id: string,
    prescriptionData: Partial<IPrescription>
  ): Promise<IPrescription | null> {
    const updateData = { ...prescriptionData, updatedAt: new Date() };

    const result = await PrescriptionModel.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: "after", new: true }
    );

    return result ? result.toObject() : null;
  }
}
