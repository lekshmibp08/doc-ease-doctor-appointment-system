import { NextFunction, Request, Response } from "express";
import { SlotRepository } from "../../infrastructure/database/repositories/slotRepository";
import { UpdateSlotUseCase } from "../../application/useCases/implimentations/doctor/updateSlotUseCase";
import { FetchSlotUseCase } from "../../application/useCases/implimentations/user/fetchSlotUseCase";
import { UpdateSlotTimeUseCase } from "../../application/useCases/implimentations/doctor/updateSlotTimeUseCase";
import { SlotUseCase } from "../../application/useCases/implimentations/slotUseCase";

const slotRepository = new SlotRepository();
const slotUseCase = new SlotUseCase(slotRepository)
const updateSlotUseCase = new UpdateSlotUseCase(slotRepository);
const fetchSlotUseCase = new FetchSlotUseCase(slotRepository);
const updateSlotTimeUseCase = new UpdateSlotTimeUseCase(slotRepository);

export const slotController = {
  async generateSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await slotUseCase.generateSlots(req.body);
      res.status(201).json({ message: "Slots generated successfully!" });
    } catch (error) {
      next(error);
    }
  },

  async fetchSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filteredSlots, slotDataAll, slotId } =
        await slotUseCase.fetchSlots(req.query);
      res
        .status(200)
        .json({ slotDataFiltered: filteredSlots, slotDataAll, slotId });
    } catch (error) {
      next(error);
    }
  },

  updateSlotStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { slotId, timeSlotId, status } = req.body;

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
      next(error);
    }
  },

  fetchSlotsForUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { doctorId } = req.params;
    const date = req.query.date as string;
    try {
      const existingSlot = await fetchSlotUseCase.execute(doctorId, date);
      res.status(200).json({
        timeSlots: existingSlot?.timeSlots,
        slotId: existingSlot?._id,
      });
    } catch (error) {
      next(error);
    }
  },

  updateSlotTime: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { slotId, timeSlotId, newTime } = req.body;

    try {
      const success = await updateSlotTimeUseCase.execute(
        slotId,
        timeSlotId,
        newTime
      );
      res.status(200).json({ success });
    } catch (error: any) {
      next(error);
    }
  },
};
