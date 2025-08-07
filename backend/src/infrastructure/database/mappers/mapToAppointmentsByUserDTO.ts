import { AppointmentsByUserIdDTO } from "../../../dtos/dtos";

export const mapToAppointmentsByUserDTO = (
  doc: any
): AppointmentsByUserIdDTO => ({
  _id: doc._id.toString(),
  doctorId: {
    _id: doc.doctorId._id.toString(),
    fullName: doc.doctorId.fullName,
  },
  userId: doc.userId.toString(),
  date: doc.date,
  slotId: doc.slotId ? {
    _id: doc.slotId._id.toString(),
    doctorId: doc.slotId.doctorId.toString(),
    date: doc.slotId.date,
  } : {
    _id: "",
    doctorId: "",
    date: new Date(),
  },
  timeSlotId: doc.timeSlotId.toString(),
  time: doc.time,
  isPaid: doc.isPaid,
  isCancelled: doc.isCancelled,
  isCompleted: doc.isCompleted,
  isReviewed: doc.isReviewed,
  updatedAt: doc.updatedAt,
  createdAt: doc.createdAt,
});
