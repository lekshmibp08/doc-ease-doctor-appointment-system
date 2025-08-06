import { IAppointment } from "../../../domain/entities/Appoinment"; 
import { IAppointmentDocument } from "../models/AppoinmentModel"; 



export const mapToAppointmentEntity = (doc: IAppointmentDocument): IAppointment => {
  return new IAppointment(
    doc._id.toString(),
    doc.doctorId?.toString() || doc.doctorId?._id?.toString(),
    doc.userId?.toString() || doc.userId?._id?.toString(),
    doc.date,
    doc.slotId?.toString() || doc.slotId?._id?.toString(),
    doc.timeSlotId?.toString() || doc.timeSlotId?._id?.toString(),
    doc.time,
    doc.modeOfVisit,
    doc.amount,
    doc.paymentId,
    doc.isPaid,
    doc.isCancelled,
    doc.refundAmount,
    doc.refundStatus,
    doc.refundTransactionId,
    doc.videoCallEnabled,
    doc.chatEnabled,
    doc.isCompleted,
    doc.rating,
    doc.reviewMessage,
    doc.videoCallId,
    doc.isReviewed,
    doc.updatedAt,
    doc.createdAt
  );
};
