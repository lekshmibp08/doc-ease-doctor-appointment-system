import { RRule } from "rrule";
import { SlotRepository } from "../../infrastructure/database/repositories/SlotRepository";
import { Slot } from "../../domain/entities/Slot";
import { filterSlotsByPeriod } from "../test/slotFilter";

interface GenerateSlotsDTO {
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

type TimePeriod = "Morning" | "Afternoon" | "Evening";

class SlotUseCase {
  private slotRepository: SlotRepository;

  constructor() {
    this.slotRepository = new SlotRepository();
  }

  private formatTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    let formattedHours = hours.toString().padStart(2, "0");

    return `${formattedHours}:${minutes} ${period}`;
  }

  /** Generate Slots **/
async generateSlots({
  doctorId,
  startDate,
  repeat,
  availableDays,
  duration,
}: GenerateSlotsDTO): Promise<void> {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(startDateObj);

  // Set end date based on recurrence type
  endDateObj.setDate(
    repeat === "weekly"
      ? startDateObj.getDate() + 6 // 7-day range
      : startDateObj.getDate() + 29 // 30-day range
  );

  const slotsToSave: Slot[] = [];

  for (const { day, startTime, endTime } of availableDays) {
    const weekdayIndex = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"].indexOf(day.toUpperCase());

    if (weekdayIndex === -1) {
      throw new Error(`Invalid day: ${day}`);
    }

    let currentDate = new Date(startDateObj);

    while (currentDate <= endDateObj) {
      if (currentDate.getDay() === weekdayIndex) {
        const slotDate = new Date(currentDate);
        const startDateTime = new Date(slotDate);
        const [startHour, startMinute] = startTime.split(":").map(Number);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date(slotDate);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        const timeSlots = [];
        let currentTime = new Date(startDateTime);

        while (currentTime < endDateTime) {
          timeSlots.push({
            time: this.formatTime(currentTime),
            status: "Not Booked",
            isAvailable: true,
          });

          currentTime = new Date(currentTime.getTime() + duration * 60000);
        }

        slotsToSave.push({
          doctorId,
          date: slotDate,
          timeSlots,
        } as Slot);
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  await this.slotRepository.saveSlots(slotsToSave);
}

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
      const filteredSlots: any = [];
      const slotDataAll: any = [];
      const slotId: any = null;
      return { filteredSlots, slotDataAll, slotId };
    }
  };
}

export default new SlotUseCase();