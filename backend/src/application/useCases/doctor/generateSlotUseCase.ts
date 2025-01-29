import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { Slot } from "../../../domain/entities/Slot";
import { generateWholeDaySlots, convertTo24HourFormat } from "../../test/slotUtils";
import { filterSlotsByPeriod } from "../../test/slotFilter";

type TimePeriod = "Morning" | "Afternoon" | "Evening";

export const generateSlotUseCase  = async (
    slotRepository: ISlotRepository,
    doctorId: string,
    date: any,
    startTime: any,
    endTime: any
): Promise<any> => {

    const start = convertTo24HourFormat(startTime);
    const end = convertTo24HourFormat(endTime);

    let startTimeObj = new Date(date);
    startTimeObj.setHours(start.hour, start.minute, 0);

    let endTimeObj = new Date(date);
    endTimeObj.setHours(end.hour, end.minute, 0);


    const timeSlots = generateWholeDaySlots(startTimeObj, endTimeObj);

    const newSlot = await slotRepository.createSlots({
        doctorId,
        date,
        timeSlots,
    })
    const slotId = newSlot._id;
    const slotDataAll = newSlot.timeSlots
    console.log('====================================');
    console.log("new slot id: ", slotId);
    console.log("new slot: ", slotDataAll);
    console.log('====================================');

    
    return {slotDataAll, slotId};
}

