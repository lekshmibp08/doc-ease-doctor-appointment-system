import { IUpdateSlotUseCase } from "../../interfaces/doctor/doctorUsecaseInterfaces";
import { ISlotRepository } from "../../../../domain/repositories/ISlotRepository";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { AppError } from "../../../../shared/errors/appError";

export class UpdateSlotUseCase implements IUpdateSlotUseCase {
  constructor(private slotRepository: ISlotRepository) {}

  async execute(
    slotId: string,
    timeSlotId: string,
    status: string
  ): Promise<any> {
    let updation: boolean;

    if (status === "Unavailable") {
      updation = false;
    } else if (status === "Available") {
      updation = true;
    } else {
      throw new AppError("Invalid status value", HttpStatusCode.BAD_REQUEST);
    }

    const updatedSlot = await this.slotRepository.findByIdAndUpdateAvailability(
      slotId,
      timeSlotId,
      updation
    );

    return { updatedSlot, updation };
  }
}
