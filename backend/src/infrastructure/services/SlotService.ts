/* eslint-disable prefer-const */
import { RRule } from "rrule";
import { Slot } from "../../domain/entities/slot";

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

class SlotService {
  private formatTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    let formattedHours = hours.toString().padStart(2, "0");

    return `${formattedHours}:${minutes} ${period}`;
  }

  generateSlots({
    doctorId,
    startDate,
    repeat,
    availableDays,
    duration,
  }: GenerateSlotsDTO): Slot[] {
    const startDateObj = new Date(startDate);
    const slotsToSave: Slot[] = [];

    for (const { day, startTime, endTime } of availableDays) {
      // Convert day string (MO, TU, WE, etc.) to RRule weekday object
      const weekday = (() => {
        switch (day.toUpperCase()) {
          case "MO":
            return RRule.MO;
          case "TU":
            return RRule.TU;
          case "WE":
            return RRule.WE;
          case "TH":
            return RRule.TH;
          case "FR":
            return RRule.FR;
          case "SA":
            return RRule.SA;
          case "SU":
            return RRule.SU;
          default:
            throw new Error(`Invalid day: ${day}`);
        }
      })();

      // Define recurrence rule for this specific day
      const rule = new RRule({
        freq: repeat === "weekly" ? RRule.WEEKLY : RRule.MONTHLY,
        interval: 1,
        byweekday: [weekday],
        dtstart: startDateObj,
        until:
          repeat === "weekly"
            ? new Date(startDateObj.getTime() + 7 * 24 * 60 * 60 * 1000)
            : new Date(
                startDateObj.getFullYear(),
                startDateObj.getMonth() + 1,
                startDateObj.getDate()
              ),
      });

      const dates = rule.all();

      for (const date of dates) {
        const slotDate = new Date(date);
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
    }

    return slotsToSave;
  }
}

export default new SlotService();
