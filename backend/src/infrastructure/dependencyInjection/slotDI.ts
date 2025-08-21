import { SlotRepository } from "../database/repositories/slotRepository";
import { SlotUseCase } from "../../application/useCases/implimentations/slotUseCase";
import { UpdateSlotUseCase } from "../../application/useCases/implimentations/doctor/updateSlotUseCase";
import { FetchSlotUseCase } from "../../application/useCases/implimentations/user/fetchSlotUseCase";
import { UpdateSlotTimeUseCase } from "../../application/useCases/implimentations/doctor/updateSlotTimeUseCase";
import { SlotController } from "../../interfaces/controllers/slotController";

export function createSlotController() {
  const slotRepository = new SlotRepository();

  const slotUseCase = new SlotUseCase(slotRepository);
  const updateSlotUseCase = new UpdateSlotUseCase(slotRepository);
  const fetchSlotUseCase = new FetchSlotUseCase(slotRepository);
  const updateSlotTimeUseCase = new UpdateSlotTimeUseCase(slotRepository);

  return new SlotController(
    slotUseCase,
    updateSlotUseCase,
    fetchSlotUseCase,
    updateSlotTimeUseCase
  );
}
