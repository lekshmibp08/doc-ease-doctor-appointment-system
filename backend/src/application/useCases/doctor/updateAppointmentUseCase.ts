import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

export const updateAppointmentUseCase = async (
    appointmentRepository: IAppointmentRepository,
    appointmentId: string,
    isCompleted: boolean
) => {
    
    const updates = { isCompleted : isCompleted };

    const updatedAppointment = await appointmentRepository.updateAppointment(
        appointmentId, updates
    );

    return updatedAppointment;
}