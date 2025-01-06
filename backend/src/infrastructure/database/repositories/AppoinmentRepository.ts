import { PipelineStage } from "mongoose";
import AppointmentModel from "../models/AppoinmentModel";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const createAppointmentRepository = (): IAppointmentRepository => ({
    createAppointment: async (appoinmentData) => {
        const appoinmentDoc = await AppointmentModel.create(appoinmentData);
        return appoinmentDoc
    },
    getAppointmentsByUserId: async (userId: string) => {
        console.log(userId);
        
        const appointments = await AppointmentModel.find({ userId })
        .populate('doctorId slotId timeSlotId')
        .sort({ createdAt: -1 });;
        return appointments;
    },
    findAppointmentsById: async (appointmentId: string) => {
        const appointment = await AppointmentModel.findById(appointmentId);
        return appointment;
    },
    updateAppointment: async (appointmentId: string, updates: Partial<IAppointment>) => {
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
          appointmentId,
          { $set: updates }, // Apply the updates passed to the function
          { new: true } // Return the updated document
        );
    
        return updatedAppointment;
    },
    getAppointmentsWithPagination: async (skip, limit, searchQuery) => {
        const pipeline: PipelineStage[]  = [
            // Populate doctorId
            {
                $lookup: {
                    from: "doctors", // Replace with your Doctor collection name
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            { $unwind: "$doctor" }, // Unwind the populated doctor array
            {
                $lookup: {
                    from: "users", // Replace with your User collection name
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" }, // Unwind the populated user array
            // Apply search query
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
            // Pagination
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];
    
        const appointments = await AppointmentModel.aggregate(pipeline);
        return appointments;
    },

    countAppointments: async (searchQuery) => {
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
    }, 

    getAppointmentsByDoctorId: async (filter, skip, limit) => {
        const appointments = await AppointmentModel.find(filter)
            .populate("userId", "fullName")
            .skip(skip)
            .limit(limit)
            .exec();
        
        const totalAppointments = await AppointmentModel.countDocuments(filter);

        return { appointments, totalAppointments };
    }



})

