import type { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { SlotUseCase } from "../../application/useCases/implimentations/slotUseCase";
import { UpdateSlotUseCase } from "../../application/useCases/implimentations/doctor/updateSlotUseCase";
import { FetchSlotUseCase } from "../../application/useCases/implimentations/user/fetchSlotUseCase";
import { UpdateSlotTimeUseCase } from "../../application/useCases/implimentations/doctor/updateSlotTimeUseCase";

export class SlotController {
  constructor(
    private slotUseCase: SlotUseCase,
    private updateSlotUseCase: UpdateSlotUseCase,
    private fetchSlotUseCase: FetchSlotUseCase,
    private updateSlotTimeUseCase: UpdateSlotTimeUseCase
  ) {}

  generateSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.slotUseCase.generateSlots(req.body);
      res.status(HttpStatusCode.CREATED).json({ message: "Slots generated successfully!" });
    } catch (error) {
      next(error);
    }
  };

  fetchSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filteredSlots, slotDataAll, slotId } =
        await this.slotUseCase.fetchSlots(req.query);
      res.status(HttpStatusCode.OK).json({ slotDataFiltered: filteredSlots, slotDataAll, slotId });
    } catch (error) {
      next(error);
    }
  };

  updateSlotStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slotId, timeSlotId, status } = req.body;
      const { updation } = await this.updateSlotUseCase.execute(slotId, timeSlotId, status);
      res.status(HttpStatusCode.OK).json({ message: "Slot status updated successfully.", updation });
    } catch (error) {
      next(error);
    }
  };

  fetchSlotsForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { doctorId } = req.params;
      const date = req.query.date as string;
      const existingSlot = await this.fetchSlotUseCase.execute(doctorId, date);
      res.status(HttpStatusCode.OK).json({
        timeSlots: existingSlot?.timeSlots,
        slotId: existingSlot?._id,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSlotTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slotId, timeSlotId, newTime } = req.body;
      const success = await this.updateSlotTimeUseCase.execute(slotId, timeSlotId, newTime);
      res.status(HttpStatusCode.OK).json({ success });
    } catch (error) {
      next(error);
    }
  };
}
