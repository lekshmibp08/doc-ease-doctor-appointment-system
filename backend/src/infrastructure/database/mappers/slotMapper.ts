import { Slot, TimeSlot } from "../../../domain/entities/slot";
import { ISlotDocument } from "../models/slotModel"; 

export const mapToSlotEntity = (doc: ISlotDocument): Slot => {
  return new Slot(
    doc._id.toString(),
    doc.doctorId.toString(),
    doc.date,
    doc.timeSlots.map(
      (ts) =>
        new TimeSlot(
          ts.time,
          ts.status as "Not Booked" | "Booked",
          ts.isAvailable,
          ts._id.toString()
        )
    )
  );
};
