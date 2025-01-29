import { Request, Response } from "express";
import { fetchOrCreateSlotUseCase } from "../../../application/useCases/doctor/fetchOrCreateSlotUseCase";
import { createSlotRepository } from "../../database/repositories/SlotRepository";
import { updateSlotUseCase } from "../../../application/useCases/doctor/updateSlotUseCase";
import { fetchSlotUseCase } from "../../../application/useCases/user/fetchSlotUseCase";
import { updateSlotTimeUseCase } from "../../../application/useCases/doctor/updateSlotTimeUseCase";
import { generateSlotUseCase } from "../../../application/useCases/doctor/generateSlotUseCase";

type TimePeriod = "Morning" | "Afternoon" | "Evening";

export const slotController = {
  //fetchOrCreateSlot: async (req: Request, res: Response): Promise<void> => {        
  //  const doctorId = req.query.doctorId as string;
  //  const date = req.query.date as string;
  //  const period = req.query.timePeriod as string;
  //  const timePeriod = period as TimePeriod;
//
  //  try {
  //   console.log("Received params:", req.query); 
  //   const slotRepository = createSlotRepository();
  //   const {filteredSlots, slotDataAll, slotId} = await fetchOrCreateSlotUseCase(slotRepository, doctorId, date, timePeriod);
  //   const slotDataFiltered = filteredSlots
  //   res.status(200).json({slotDataFiltered, slotDataAll, slotId});
  //   return;
  //   
  //  } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).json({ message: "Internal server error" });
  //  }
  //  }, 
  
  fetchSlot: async (req: Request, res: Response): Promise<void> => {        
    const doctorId = req.query.doctorId as string;
    const date = req.query.date as string;
    const period = req.query.timePeriod as string;
    const timePeriod = period as TimePeriod 
    try {
     console.log("Received params:", req.query); 
     const slotRepository = createSlotRepository();
     const {filteredSlots, slotDataAll, slotId} = await fetchOrCreateSlotUseCase(slotRepository, doctorId, date, timePeriod);
     const slotDataFiltered = filteredSlots
     res.status(200).json({slotDataFiltered, slotDataAll, slotId});
     return;
     
    } catch (error) {
     console.error("Error:", error);
     res.status(500).json({ message: "Internal server error" });
    }
  }, 
  
  generateSlots: async (req: Request, res: Response): Promise<void> => {        
    const { doctorId, date, startTime, endTime } = req.body;

    
    try {
     console.log("Received params:", req.query); 
     const slotRepository = createSlotRepository();
      const { slotDataAll, slotId } = await generateSlotUseCase(slotRepository, doctorId, date, startTime, endTime);
      
      res.status(200).json({
      message: "Slots generated successfully.",
      slotDataAll,
      });
      return;
     
    } catch (error: any) {
     console.error("Error generating slots:", error);
      res.status(500).json({
        message: "An error occurred while generating slots.",
        error: error.message,
      });
    }
  }, 


  // Update slot Availability by Doctor
  updateSlotStatus: async (req: Request, res: Response): Promise<void> => {
    const { slotId, timeSlotId, status } = req.body;
    console.log("REQ BODY: ", slotId, timeSlotId, status);      
    try {
      const slotRepository = createSlotRepository();
      const { updation } = await updateSlotUseCase(slotRepository, slotId, timeSlotId, status);
      res.status(200).json({ message: "Slot status updated successfully.", updation });
    } catch (error: any) {
      console.error("Error updating slot status:", error);
      res.status(400).json({ message: error.message || "Failed to update slot status." });
    }
  },
  //Fetch Slots for User
  fetchSlotsForUser: async (req: Request, res: Response): Promise<void> => {
    const { doctorId } = req.params;
    const date = req.query.date as string;
    console.log("DOC ID AND DATE: ",doctorId, date );
    try {
      const slotRepository = createSlotRepository();
      const existingSlot = await fetchSlotUseCase(slotRepository, doctorId, date)
      console.log("CONTROLLER SLOT: ", existingSlot);
      
      const timeSlots = existingSlot?.timeSlots;
      const slotId = existingSlot?._id;
      res.status(200).json({timeSlots, slotId})
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });      
    }
  },

  // Update Slot Time by Doctor
  updateSlotTime: async (req: Request, res: Response): Promise<void> => {
    const { slotId, timeSlotId, newTime } = req.body;
    const slotRepository = createSlotRepository();

    try {
      const success = await updateSlotTimeUseCase(slotRepository, slotId, timeSlotId, newTime);
      res.status(200).json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to update slot time" });
    }
  },
  








}