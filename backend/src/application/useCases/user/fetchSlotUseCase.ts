import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export const fetchSlotUseCase  = async (
    slotRepository: ISlotRepository,
    doctorId: string,
    date: any,
): Promise<any> => {
    const existingSlot = await slotRepository.findByDoctorIdAndDate(doctorId, date);    
    console.log("EXISTING SLOTS: ",existingSlot);
    
    return existingSlot;
}