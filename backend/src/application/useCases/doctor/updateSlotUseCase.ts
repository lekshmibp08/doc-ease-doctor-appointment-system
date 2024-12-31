import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export const updateSlotUseCase = async (
  slotRepository: ISlotRepository,
  slotId: string,
  timeSlotId: string,
  status: string
): Promise<any> => {
  let updation: boolean;

  if (status === "Unavailable") {
    updation = false;
  } else if (status === "Available") {
    updation = true;
  } else {
    throw new Error("Invalid status value");
  }

  const updatedSlot = await slotRepository.findByIdAndUpdateAvailability(
    slotId,
    timeSlotId,
    updation
  );
  console.log("USECASE UPDATED SLOT: ", updatedSlot);
  

  return {updatedSlot, updation}; 
};
