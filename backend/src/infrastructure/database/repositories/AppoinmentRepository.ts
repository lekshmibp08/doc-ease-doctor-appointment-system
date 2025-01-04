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
        
        const appointments = await AppointmentModel.find({ userId }).populate('doctorId slotId timeSlotId');
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
})

