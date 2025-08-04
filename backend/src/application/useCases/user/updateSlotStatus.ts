import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export class UpdateSlotStatus {
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
    } catch (error) {
      throw new Error("Failed to update slot status: ");
    }
  }
}
