import { PipelineStage } from "mongoose";
import AppointmentModel from "../models/AppoinmentModel";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export class AppointmentRepository implements IAppointmentRepository {
  async createAppointment(appoinmentData: IAppointment) {
    const appoinmentDoc = await AppointmentModel.create(appoinmentData);
    return appoinmentDoc;
  }

  async getAppointmentsByUserId(userId: string) {
    console.log(userId);

    const appointments = await AppointmentModel.find({ userId })
      .populate("doctorId slotId timeSlotId")
      .sort({ createdAt: -1 });
    return appointments;
  }

  async findAppointmentsById(appointmentId: string) {
    const appointment = await AppointmentModel.findById(appointmentId);
    return appointment;
  }

  async findAppointmentsByIdWithDocDetails(appointmentId: string) {
    const appointment = await AppointmentModel.findById(appointmentId).populate(
      "doctorId"
    );
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
    ).lean();
    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    return updatedAppointment;
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
      .exec();

    const totalAppointments = await AppointmentModel.countDocuments(filter);

    return { appointments, totalAppointments };
  }

  async findByDoctorIdAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ) {
    return AppointmentModel.find({
      doctorId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("userId");
  }
}
