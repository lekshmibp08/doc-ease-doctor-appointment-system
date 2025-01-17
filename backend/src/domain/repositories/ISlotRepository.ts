
import { Slot } from "../entities/Slot";

export interface ISlotRepository {
    findByDoctorIdAndDate(doctorId: string, date: Date): Promise<Slot | null>;
    createSlots(slot: Slot): Promise<Slot>;
    findByIdAndUpdateAvailability(slotId: string, timeSlotId: string, updation: boolean):
        Promise<any>;
    updateSlotStatus(slotId: string, timeSlotId: string, status: string): Promise<any>;
    updateSlotTime(slotId: string, timeSlotId: string, newTime: string): Promise<boolean>;

}
