import { AllAppointmentsByAdminDTO } from "../../../dtos/dtos"; 

export const mapToAppointmentsByAdminDTO = (appointment: any): AllAppointmentsByAdminDTO => ({
  _id: appointment._id,
  user : {
    fullName: appointment.user?.fullName ?? "",
  },
  doctor : {
    fullName: appointment.doctor?.fullName ?? ""
  },
  date: appointment.date,
  time: appointment.time,
  isCompleted: appointment.isCompleted ?? false,
});
