import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/Slot";
import { generateWholeDaySlots } from "../../test/slotUtils";
import { filterSlotsByPeriod } from "../../test/slotFilter";

type TimePeriod = "Morning" | "Afternoon" | "Evening";

//export const fetchOrCreateSlotUseCase  = async (
//    slotRepository: ISlotRepository,
//    doctorId: string,
//    date: any,
//    timePeriod: TimePeriod,
//): Promise<any> => {
//
//    const existingSlot = await slotRepository.findByDoctorIdAndDate(doctorId, date);
//
//
//    if(existingSlot) {
//        const filteredSlots = filterSlotsByPeriod(timePeriod, existingSlot.timeSlots);
//        const slotId = existingSlot._id;
//        const slotDataAll = existingSlot.timeSlots
//        return {filteredSlots, slotDataAll, slotId};
//    }
//
//    const timeSlots = generateWholeDaySlots();
//
//    const newSlot = await slotRepository.createSlots({
//        doctorId,
//        date,
//        timeSlots,
//    })
//    const slotId = newSlot._id;
//    const slotDataAll = newSlot.timeSlots
//
//    const filteredSlots = filterSlotsByPeriod(timePeriod, newSlot.timeSlots)
//    return {filteredSlots, slotDataAll, slotId};
//}


export const fetchOrCreateSlotUseCase = async (
    slotRepository: ISlotRepository,
    doctorId: string,
    date: any,
    timePeriod: TimePeriod,
): Promise<any> => {

    const existingSlot = await slotRepository.findByDoctorIdAndDate(doctorId, date);
    

    if (existingSlot) {
        const filteredSlots = filterSlotsByPeriod(timePeriod, existingSlot.timeSlots);
        const slotId = existingSlot._id;
        const slotDataAll = existingSlot.timeSlots
        return { filteredSlots, slotDataAll, slotId };
    } else {
        const filteredSlots: any = [];
        const slotDataAll: any = [];
        const slotId: any = null;
        return { filteredSlots, slotDataAll, slotId };
    }

}