/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export const updateSlotStatus = async (
    slotId: string,
    timeSlotId: string,
    status: string,
    slotRepository: ISlotRepository
): Promise<void> => {
  try {
    const updatedSlot = await slotRepository.updateSlotStatus(slotId, timeSlotId, status)
    console.log(updatedSlot);
    return;
    
  } catch (error) {
    throw new Error("Failed to update slot status: ");
  }
};
