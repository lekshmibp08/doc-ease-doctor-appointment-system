import { GenerateSlotsDTO, ISlotUseCase } from "../interfaces/ISlotUseCase"
import SlotService from "../../../infrastructure/services/slotService" 
import { filterSlotsByPeriod } from "../../helper/slotFilter" 
import { Slot } from "../../../domain/entities/slot" 
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository"


export class SlotUseCase implements ISlotUseCase {

  constructor(private slotRepository: ISlotRepository) {
    this.slotRepository = slotRepository;
  }

  //Generate Slots
  async generateSlots(data: GenerateSlotsDTO): Promise<void> {
    const slotsToSave: Slot[] = SlotService.generateSlots(data);
    await this.slotRepository.saveSlots(slotsToSave);
  }

  //Fetch slots for Doctor
  async fetchSlots({
    doctorId,
    date,
    timePeriod
  }: any): Promise<any> {
    const existingSlot = await this.slotRepository.findByDoctorIdAndDate(
      doctorId,
      date
    );

    if (existingSlot) {
      const filteredSlots = filterSlotsByPeriod(timePeriod, existingSlot.timeSlots);
      const slotId = existingSlot._id;
      const slotDataAll = existingSlot.timeSlots;
      return { filteredSlots, slotDataAll, slotId };
    } else {
      return { filteredSlots: [], slotDataAll: [], slotId: null };
    }
  }
}

