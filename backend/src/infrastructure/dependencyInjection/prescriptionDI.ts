import { AppointmentRepository } from "../database/repositories/appoinmentRepository";
import { PrescriptionRepository } from "../database/repositories/prescriptionRepository";
import { PrescriptionUseCase } from "../../application/useCases/implimentations/prescriptionUseCase";
import { GetAppointmentsByIdUseCase } from "../../application/useCases/implimentations/user/getAppointmentByIdUseCase";
import { PrescriptionController } from "../../interfaces/controllers/prescriptionController";

export function createPrescriptionController() {
  const appointmentRepository = new AppointmentRepository();
  const prescriptionRepository = new PrescriptionRepository();

  const prescriptionUseCase = new PrescriptionUseCase(prescriptionRepository);
  const getAppointmentsByIdUseCase = new GetAppointmentsByIdUseCase(
    appointmentRepository
  );

  return new PrescriptionController(
    prescriptionUseCase,
    getAppointmentsByIdUseCase
  );
}
