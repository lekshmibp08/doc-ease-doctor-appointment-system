import { ISlotRepository } from "../../../../domain/repositories/ISlotRepository";

export class UpdateSlotTimeUseCase {
  constructor(private slotRepository: ISlotRepository) {}

  async execute(
    slotId: string,
    timeSlotId: string,
    newTime: string
  ): Promise<any> {
    const updatedSlotTime = await this.slotRepository.updateSlotTime(
      slotId,
      timeSlotId,
      newTime
    );

    return { updatedSlotTime };
  }
}
