import SlotModel from "../models/SlotModel";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/Slot";
import { Types } from "mongoose";

export class SlotRepository implements ISlotRepository {
  
  async saveSlots(slots: Slot[]): Promise<void> {
    await SlotModel.insertMany(slots);
  }

  async findByDoctorIdAndDate(doctorId: string, date: Date): Promise<Slot | null> {
    const slot = await SlotModel.findOne({ doctorId, date }).lean();
    if (!slot) return null;

    return {
      ...slot,
      _id: slot._id?.toString(),
      doctorId: slot.doctorId.toString(),
    } as Slot;
  }

  async createSlots(slot: Slot): Promise<Slot> {
    const newSlotDoc = await SlotModel.create(slot);
    return {
      _id: newSlotDoc._id?.toString(),
      doctorId: newSlotDoc.doctorId.toString(),
      date: newSlotDoc.date,
      timeSlots: newSlotDoc.timeSlots,
    };
  }

  async findByIdAndUpdateAvailability(slotId: string, timeSlotId: string, updation: boolean): Promise<any> {
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

  async updateSlotStatus(slotId: string, timeSlotId: string, status: string): Promise<any> {
    const slot = await SlotModel.findById(slotId);
    if (!slot) return;
    
    slot.timeSlots = slot.timeSlots.map((timeslot) => {
      if (timeslot._id?.toString() === timeSlotId) {
        timeslot.status = status;
      }
      return timeslot;
    });
    
    await slot.save();
  }

  async updateSlotTime(slotId: string, timeSlotId: string, newTime: string): Promise<boolean> {
    const result = await SlotModel.updateOne(
      { _id: slotId, "timeSlots._id": timeSlotId },
      { $set: { "timeSlots.$.time": newTime } }
    );
    return result.modifiedCount > 0;
  }
}
