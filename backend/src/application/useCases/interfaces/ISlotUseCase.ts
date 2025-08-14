import { Slot } from "../../../domain/entities/slot";

export interface GenerateSlotsDTO {
  doctorId: string;
  startDate: string;
  repeat: "weekly" | "monthly";
  availableDays: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  duration: number;
}

export interface ISlotUseCase {
  generateSlots(data: GenerateSlotsDTO): Promise<void>;
  fetchSlots(params: { doctorId: string; date: string; timePeriod: string }): Promise<{
    filteredSlots: any[];
    slotDataAll: any[];
    slotId: string | null;
  }>;
}
