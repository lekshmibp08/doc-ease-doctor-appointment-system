import { AppointmentsByIdWithDocDetailsDTO } from "../../../dtos/dtos";

export const mapToAppointmentWithDocDetailsDTO = (doc: any): AppointmentsByIdWithDocDetailsDTO => {
  return {
    _id: doc._id.toString(),
    doctorId: {
      _id: doc.doctorId?._id?.toString() || '',
      fullName: doc.doctorId?.fullName || '',
      email: doc.doctorId?.email || '',
      mobileNumber: doc.doctorId?.mobileNumber || '',
      registerNumber: doc.doctorId?.registerNumber || '',
    },
    userId: doc.userId?.toString() || '',
    date: doc.date,
    slotId: doc.slotId?.toString() || '',
    timeSlotId: doc.timeSlotId?.toString() || '',
    time: doc.time,
    isCancelled: doc.isCancelled,
    isCompleted: doc.isCompleted,
    rating: doc.rating,
    reviewMessage: doc.reviewMessage,
    isReviewed: doc.isReviewed,
    updatedAt: doc.updatedAt,
    createdAt: doc.createdAt,
  };
};
