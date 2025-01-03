import SlotModel from "../models/SlotModel";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/Slot";
import { Types } from "mongoose";

export const createSlotRepository = (): ISlotRepository => ({
  // Find a slot by doctorId and date
  findByDoctorIdAndDate: async (doctorId, date) => {
    const slot = await SlotModel.findOne({ doctorId, date }).lean();
    if (!slot) return null;

    // Ensure the _id and doctorId are cast properly
    return {
      ...slot,
      _id: slot._id?.toString(), 
      doctorId: slot.doctorId.toString(), 
    } as Slot;
  },

  // Create slots for a doctor
  createSlots: async (slot) => {
    const newSlotDoc = await SlotModel.create(slot);

    // Convert the Mongoose document to the Slot type
    const newSlot: Slot = {
      _id: newSlotDoc._id?.toString(),  
      doctorId: newSlotDoc.doctorId.toString(),  
      date: newSlotDoc.date,
      timeSlots: newSlotDoc.timeSlots,
    };

    return newSlot;
  },
  findByIdAndUpdateAvailability: async(slotId, timeSlotId, updation) => {
    const slot = await SlotModel.findById(slotId);
    console.log("UPDATION RECEIVED: ",updation);
    

    const updatedTimeSlots = slot?.timeSlots.map((timeslot) => {
      if (timeslot._id?.toString() === timeSlotId) {
        console.log(timeslot);        
        timeslot.isAvailable = updation;
        return timeslot;
      }
      return timeslot;
    });    
    
    await slot?.save();    
    return slot
  },
  updateSlotStatus: async (slotId, timeSlotId, UpdatedStatus) => {
    const slot = await SlotModel.findById(slotId);

    const updatedTimeSlots = slot?.timeSlots.map((timeslot) => {
      if (timeslot._id?.toString() === timeSlotId) {
        console.log("Identified: ", timeslot);        
        timeslot.status = UpdatedStatus;
        return timeslot;
      }
      return timeslot;
    });        
    await slot?.save();   
  },

});
