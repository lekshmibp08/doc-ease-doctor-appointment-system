import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/Slot";
import { generateWholeDaySlots } from "../../test/slotUtils";
import { filterSlotsByPeriod } from "../../test/slotFilter";

type TimePeriod = "Morning" | "Afternoon" | "Evening";

export const fetchOrCreateSlotUseCase  = async (
    slotRepository: ISlotRepository,
    doctorId: string,
    date: any,
    timePeriod: TimePeriod,
): Promise<any> => {

    const existingSlot = await slotRepository.findByDoctorIdAndDate(doctorId, date);
    

    if(existingSlot) {
        const filteredSlots = filterSlotsByPeriod(timePeriod, existingSlot.timeSlots);
        const slotId = existingSlot._id
        return {filteredSlots, slotId};
    }

    const timeSlots = generateWholeDaySlots();

    const newSlot = await slotRepository.createSlots({
        doctorId,
        date,
        timeSlots,
    })
    const slotId = newSlot._id;
    
    const filteredSlots = filterSlotsByPeriod(timePeriod, newSlot.timeSlots)
    return {filteredSlots, slotId};
}