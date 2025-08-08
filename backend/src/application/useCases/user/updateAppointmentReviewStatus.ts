import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/appError";

export const updateAppointmentReviewStatus = async (
  appointmentId: string,
  appointmentRepository: IAppointmentRepository,
  isReviewed: boolean
): Promise<any> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsById(
      appointmentId
    );
    if (!appointment) {
      throw new AppError("Appointment not Found", HttpStatusCode.NOT_FOUND);
    }
    const updates = { isReviewed: isReviewed };
    const updatedAppointment = await appointmentRepository.updateAppointment(
      appointmentId,
      updates
    );

    return updatedAppointment?.isReviewed;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to fetch appointments",
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};
