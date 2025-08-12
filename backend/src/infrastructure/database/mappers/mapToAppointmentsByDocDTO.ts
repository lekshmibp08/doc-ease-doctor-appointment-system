import { AppointmentsByDocIdDTO } from "../../../dtos/dtos";

export const mapToAppointmentsByDocDTO = (doc: any): AppointmentsByDocIdDTO => ({
  _id: doc._id.toString(),
  doctorId: doc.doctorId.toString(),
  userId: {
    _id: doc.userId._id.toString(),
    fullName: doc.userId.fullName,
    age: doc.userId.age
  },
  date: doc.date,
  time: doc.time,
  modeOfVisit: doc.modeOfVisit,
  isCancelled: doc.isCancelled,
  isCompleted: doc.isCompleted,
  updatedAt: doc.updatedAt,
  createdAt: doc.createdAt,
});
