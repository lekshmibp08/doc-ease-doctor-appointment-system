import { IUpdateSlotStatus } from "../../interfaces/user/userUseCaseInterfaces";
import { ISlotRepository } from "../../../../domain/repositories/ISlotRepository";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { AppError } from "../../../../shared/errors/appError";

export class UpdateSlotStatus implements IUpdateSlotStatus {
  constructor(private slotRepository: ISlotRepository) {}

  async execute(
    slotId: string,
    timeSlotId: string,
    status: string
  ): Promise<void> {
    try {
      const updatedSlot = await this.slotRepository.updateSlotStatus(
        slotId,
        timeSlotId,
        status
      );
      return;
    } catch (error: any) {
      throw new AppError(
        error.message || "Failed to update slot status",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
