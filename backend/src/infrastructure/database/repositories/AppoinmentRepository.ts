import { PipelineStage } from "mongoose";
import AppointmentModel from "../models/appoinmentModel";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/appoinment";
import { AppointmentInputDTO } from "../../../dtos/dtos";
import { mapToAppointmentEntity } from "../mappers/appointmentMapper";

export class AppointmentRepository implements IAppointmentRepository {
  async createAppointment(appoinmentData: AppointmentInputDTO) {
    const appointmentDoc = await AppointmentModel.create(appoinmentData);
    return mapToAppointmentEntity(appointmentDoc);
  }

  async getAppointmentsByUserId(userId: string) {
    const appointments = await AppointmentModel.find({ userId })
      .populate("doctorId slotId")
      .sort({ createdAt: -1 })
      .lean();
    return appointments;
  }

  async findAppointmentsById(appointmentId: string) {
    const appointment = await AppointmentModel.findById(appointmentId);
    return appointment ? mapToAppointmentEntity(appointment) : null;
  }

  async findAppointmentsByIdWithDocDetails(appointmentId: string) {
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("doctorId")
      .lean();
    return appointment;
  }

  async updateAppointment(
    appointmentId: string,
    updates: Partial<IAppointment>
  ) {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: updates },
      { new: true }
    );
    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    return mapToAppointmentEntity(updatedAppointment);
  }

  async getAppointmentsWithPagination(
    skip: number,
    limit: number,
    searchQuery: any
  ) {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $match: searchQuery
          ? {
              $or: [
                { "doctor.fullName": { $regex: searchQuery, $options: "i" } },
                { "user.fullName": { $regex: searchQuery, $options: "i" } },
              ],
            }
          : {},
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const appointments = await AppointmentModel.aggregate(pipeline);
    return appointments;
  }

  async countAppointments(searchQuery: any) {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: searchQuery
          ? {
              $or: [
                { "doctor.fullName": { $regex: searchQuery, $options: "i" } },
                { "user.fullName": { $regex: searchQuery, $options: "i" } },
              ],
            }
          : {},
      },
      {
        $count: "total",
      },
    ];

    const result = await AppointmentModel.aggregate(pipeline);
    return result.length > 0 ? result[0].total : 0;
  }

  async getAppointmentsByDoctorId(filter: any, skip: number, limit: number) {
    const appointments = await AppointmentModel.find(filter)
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalAppointments = await AppointmentModel.countDocuments(filter);

    return {
      appointments: appointments,
      totalAppointments,
    };
  }

  async findByDoctorIdAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ) {
    const appointments = await AppointmentModel.find({
      doctorId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("userId");
    return appointments.map(mapToAppointmentEntity);
  }
}
