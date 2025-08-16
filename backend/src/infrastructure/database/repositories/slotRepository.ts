import SlotModel from "../models/slotModel";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/slot";
import { mapToSlotEntity } from "../mappers/slotMapper";

export class SlotRepository implements ISlotRepository {
  async saveSlots(slots: Slot[]): Promise<void> {
    await SlotModel.insertMany(slots);
  }

  async findByDoctorIdAndDate(
    doctorId: string,
    date: Date
  ): Promise<Slot | null> {
    const slotDoc = await SlotModel.findOne({ doctorId, date });
    if (!slotDoc) return null;

    return mapToSlotEntity(slotDoc);
  }

  async createSlots(slot: Slot): Promise<Slot> {
    const newSlotDoc = await SlotModel.create(slot);
    return mapToSlotEntity(newSlotDoc);
  }

  async findByIdAndUpdateAvailability(
    slotId: string,
    timeSlotId: string,
    updation: boolean
  ): Promise<any> {
    const slot = await SlotModel.findById(slotId);
    if (!slot) return null;

    slot.timeSlots = slot.timeSlots.map((timeslot) => {
      if (timeslot._id?.toString() === timeSlotId) {
        timeslot.isAvailable = updation;
      }
      return timeslot;
    });

    await slot.save();
    return slot;
  }

  async updateSlotStatus(
    slotId: string,
    timeSlotId: string,
    status: string
  ): Promise<any> {
    const slot = await SlotModel.findById(slotId);
    if (!slot) return;

    slot.timeSlots = slot.timeSlots.map((timeslot) => {
      if (timeslot._id?.toString() === timeSlotId.toString()) {
        timeslot.status = status;
      }
      return timeslot;
    });

    await slot.save();
  }

  async updateSlotTime(
    slotId: string,
    timeSlotId: string,
    newTime: string
  ): Promise<boolean> {
    const result = await SlotModel.updateOne(
      { _id: slotId, "timeSlots._id": timeSlotId },
      { $set: { "timeSlots.$.time": newTime } }
    );
    return result.modifiedCount > 0;
  }
}
