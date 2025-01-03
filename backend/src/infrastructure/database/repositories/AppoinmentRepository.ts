import AppointmentModel from "../models/AppoinmentModel";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const createAppointmentRepository = (): IAppointmentRepository => ({
    createAppointment: async (appoinmentData) => {
        const appoinmentDoc = await AppointmentModel.create(appoinmentData);
        return appoinmentDoc
    }
})

