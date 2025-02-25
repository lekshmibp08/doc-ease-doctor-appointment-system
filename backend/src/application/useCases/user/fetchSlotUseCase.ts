import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/Slot";
import { generateWholeDaySlots } from "../../helper/slotUtils";
import { filterSlotsByPeriod } from "../../helper/slotFilter";

type TimePeriod = "Morning" | "Afternoon" | "Evening";

export const fetchSlotUseCase  = async (
    slotRepository: ISlotRepository,
    doctorId: string,
    date: any,
): Promise<any> => {
    const existingSlot = await slotRepository.findByDoctorIdAndDate(doctorId, date);    
    console.log("EXISTING SLOTS: ",existingSlot);
    
    return existingSlot;
}