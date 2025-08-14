import { GenerateSlotsDTO, ISlotUseCase } from "../interfaces/ISlotUseCase"
import { SlotRepository } from "../../../infrastructure/database/repositories/slotRepository" 
import SlotService from "../../../infrastructure/services/slotService" 
import { filterSlotsByPeriod } from "../../helper/slotFilter" 
import { Slot } from "../../../domain/entities/slot" 


class SlotUseCase implements ISlotUseCase {
  private slotRepository: SlotRepository;

  constructor() {
    this.slotRepository = new SlotRepository();
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

export default new SlotUseCase();
