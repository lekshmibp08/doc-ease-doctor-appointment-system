
import { Slot } from "../entities/Slot";

export interface ISlotRepository {
    findByDoctorIdAndDate(doctorId: string, date: Date): Promise<Slot | null>;
    createSlots(slot: Slot): Promise<Slot>;
    findByIdAndUpdateAvailability(slotId: string, timeSlotId: string, updation: boolean):
        Promise<any>;
}
