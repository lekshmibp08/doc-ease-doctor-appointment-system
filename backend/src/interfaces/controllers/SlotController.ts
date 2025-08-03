import { Request, Response } from "express";
import { SlotRepository } from "../../infrastructure/database/repositories/SlotRepository";
import { UpdateSlotUseCase } from "../../application/useCases/doctor/updateSlotUseCase";
import { FetchSlotUseCase } from "../../application/useCases/user/fetchSlotUseCase";
import { UpdateSlotTimeUseCase } from "../../application/useCases/doctor/updateSlotTimeUseCase";
import SlotUseCase from "../../application/useCases/SlotUseCase";

const slotRepository = new SlotRepository();
const updateSlotUseCase = new UpdateSlotUseCase(slotRepository);
const fetchSlotUseCase = new FetchSlotUseCase(slotRepository);
const updateSlotTimeUseCase = new UpdateSlotTimeUseCase(slotRepository);

export const slotController = {
  async generateSlots(req: Request, res: Response): Promise<void> {
    try {
      await SlotUseCase.generateSlots(req.body);
      res.status(201).json({ message: "Slots generated successfully!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async fetchSlot(req: Request, res: Response): Promise<void> {
    try {
      console.log("Received params:", req.query);
      const { filteredSlots, slotDataAll, slotId } =
        await SlotUseCase.fetchSlots(req.query);
      res
        .status(200)
        .json({ slotDataFiltered: filteredSlots, slotDataAll, slotId });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateSlotStatus: async (req: Request, res: Response): Promise<void> => {
    const { slotId, timeSlotId, status } = req.body;
    console.log("REQ BODY:", slotId, timeSlotId, status);

    try {
      const { updation } = await updateSlotUseCase.execute(
        slotId,
        timeSlotId,
        status
      );
      res
        .status(200)
        .json({ message: "Slot status updated successfully.", updation });
    } catch (error: any) {
      console.error("Error updating slot status:", error);
      res
        .status(400)
        .json({ message: error.message || "Failed to update slot status." });
    }
  },

  fetchSlotsForUser: async (req: Request, res: Response): Promise<void> => {
    const { doctorId } = req.params;
    const date = req.query.date as string;
    try {
      const existingSlot = await fetchSlotUseCase.execute(doctorId, date);
      res.status(200).json({
        timeSlots: existingSlot?.timeSlots,
        slotId: existingSlot?._id,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateSlotTime: async (req: Request, res: Response): Promise<void> => {
    const { slotId, timeSlotId, newTime } = req.body;

    try {
      const success = await updateSlotTimeUseCase.execute(
        slotId,
        timeSlotId,
        newTime
      );
      res.status(200).json({ success });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to update slot time" });
    }
  },
};
