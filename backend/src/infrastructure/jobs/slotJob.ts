import schedule from "node-schedule";
import SlotModel from "../database/models/slotModel";

// Utility to generate slots
const generateSlotsForDate = (date: Date) => {
  const morningSlots = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoonSlots = ["12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:30"];
  const eveningSlots = ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30"];

  const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
  return allSlots.map((time) => ({
    time: `${time} ${time < "12:00" ? "AM" : "PM"}`, // Append AM/PM
    status: "Not Booked",
    isAvailable: true,
  }));
};

// Scheduled job to maintain slots
export const setupSlotMaintenanceJob = () => {
  schedule.scheduleJob("0 0 * * *", async () => {
    console.log("Running daily slot maintenance job...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newDate = new Date(today);
    newDate.setDate(today.getDate() + 10); // Calculate the 11th day

    try {
      // Remove expired slots
      //await SlotModel.deleteMany({ date: { $lt: today } });
      //console.log("Expired slots removed.");

      // Add slots for the 11th day
      const newSlots = generateSlotsForDate(newDate);
      await SlotModel.create({ date: newDate, timeSlots: newSlots });
      console.log(`Added slots for date: ${newDate.toISOString().split("T")[0]}`);
    } catch (error) {
      console.error("Error during slot maintenance job:", error);
    }
  });
};
