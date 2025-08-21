import { AppointmentRepository } from "../database/repositories/appoinmentRepository";
import { SlotRepository } from "../database/repositories/slotRepository";

import { AppointmentController } from "../../interfaces/controllers/appoinmentController"; 

import { CreateAppointmentUseCase } from "../../application/useCases/implimentations/user/createAppointmentUseCase "; 
import { GetAppointmentsByUserUseCase } from "../../application/useCases/implimentations/user/getAppointmentsByUserUseCase "; 
import { CancelAppointmentByUserUsecase } from "../../application/useCases/implimentations/user/cancelAppointmentUseCase";
import { UpdateSlotStatus } from "../../application/useCases/implimentations/user/updateSlotStatusUseCase";
import { UpdateAppointment } from "../../application/useCases/implimentations/user/updateAppointmentUseCase";
import { RescheduleAppointmentUseCase } from "../../application/useCases/implimentations/user/rescheduleAppointmentUseCase";
import { ListAllAppointmentsForAdmin } from "../../application/useCases/implimentations/admin/listAllAppointmentsUseCase";
import { GetAppointmentsByDoctorIdUseCase } from "../../application/useCases/implimentations/doctor/getAppointmentsByDoctorIdUseCase";
import { UpdateAppointmentUseCase } from "../../application/useCases/implimentations/doctor/updateAppointmentUseCase";

export function createAppointmentController() {
  const appointmentRepository = new AppointmentRepository();
  const slotRepository = new SlotRepository();

  const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepository, slotRepository);
  const getAppointmentsByUserUseCase = new GetAppointmentsByUserUseCase(appointmentRepository);
  const cancelAppointmentByUserUsecase = new CancelAppointmentByUserUsecase(appointmentRepository);
  const updateSlotStatus = new UpdateSlotStatus(slotRepository);
  const updateAppointment = new UpdateAppointment(appointmentRepository);
  const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(appointmentRepository, slotRepository);
  const listAllAppointmentsForAdmin = new ListAllAppointmentsForAdmin(appointmentRepository);
  const getAppointmentsByDoctorIdUseCase = new GetAppointmentsByDoctorIdUseCase(appointmentRepository);
  const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);

  return new AppointmentController(
    createAppointmentUseCase,
    getAppointmentsByUserUseCase,
    cancelAppointmentByUserUsecase,
    updateSlotStatus,
    updateAppointment,
    rescheduleAppointmentUseCase,
    listAllAppointmentsForAdmin,
    getAppointmentsByDoctorIdUseCase,
    updateAppointmentUseCase
  );
};
