import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export class UpdateSlotUseCase {
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
      throw new Error("Invalid status value");
    }

    const updatedSlot = await this.slotRepository.findByIdAndUpdateAvailability(
      slotId,
      timeSlotId,
      updation
    );
    console.log("USECASE UPDATED SLOT: ", updatedSlot);

    return { updatedSlot, updation };
  }
}
