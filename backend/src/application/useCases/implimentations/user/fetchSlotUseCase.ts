import { IFetchSlotUseCase } from "../../interfaces/user/userUseCaseInterfaces";
import { ISlotRepository } from "../../../../domain/repositories/ISlotRepository";

export class FetchSlotUseCase implements IFetchSlotUseCase {
  constructor(private slotRepository: ISlotRepository) {}

  async execute(doctorId: string, date: any): Promise<any> {
    const existingSlot = await this.slotRepository.findByDoctorIdAndDate(
      doctorId,
      date
    );

    return existingSlot;
  }
}
