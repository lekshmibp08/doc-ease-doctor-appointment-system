import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export const cancelAppointmentByUserUsecase = async (
    appointmentId: string,
    appointmentRepository: IAppointmentRepository,
    slotRepository: ISlotRepository
): Promise<any> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsById(appointmentId);
    if(!appointment) {
        throw new Error("Appointment not Found");
    }
    const updates = { isCancelled : true };
    const updatedAppointment = await appointmentRepository.updateAppointment(appointmentId, updates);

    const slotId = appointment.slotId as string;
    const timeSlotId = appointment.timeSlotId.toString().replace(/ObjectId\("(.*)"\)/, '$1');
    const status = "Not Booked";

    const updatedSlot = await slotRepository.updateSlotStatus(slotId, timeSlotId, status)
    console.log(updatedSlot);
    
    return updatedAppointment?.isCancelled;
    
  } catch (error) {
    throw new Error("Failed to fetch appointments");
  }
};
