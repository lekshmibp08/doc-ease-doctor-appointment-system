import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export const updateSlotTimeUseCase = async (
  slotRepository: ISlotRepository,
  slotId: string,
  timeSlotId: string,
  newTime: string
): Promise<any> => {


  const updatedSlotTime = await slotRepository.updateSlotTime(slotId, timeSlotId, newTime)
  console.log("USECASE UPDATED SLOT: ", updatedSlotTime);
  

  return {updatedSlotTime}; 
};
