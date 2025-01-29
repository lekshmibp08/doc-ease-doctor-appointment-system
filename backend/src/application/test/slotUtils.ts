
// export const MORNING_SLOTS = [
//     "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
//     "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"
//   ];
//
//   export const AFTERNOON_SLOTS = [
//     "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
//     "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
//   ];
//
//   export const EVENING_SLOTS = [
//     "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM",
//     "07:30 PM", "08:00 PM"
//   ];
//
//   // Helper function to generate time slots for the entire day
//   export const generateWholeDaySlots = () => {
//     return [
//       ...MORNING_SLOTS.map(time => ({ time, status: "Not Booked", isAvailable: true })),
//       ...AFTERNOON_SLOTS.map(time => ({ time, status: "Not Booked", isAvailable: true })),
//       ...EVENING_SLOTS.map(time => ({ time, status: "Not Booked", isAvailable: true }))
//     ];
//   };

    // Convert time to 24-hour format
export const convertTo24HourFormat = (time: string) => {
  const [hours, minutes] = time.split(/[: ]/);
  const isPM = time.includes("PM");
  let hour = parseInt(hours, 10);
  hour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;
  return { hour, minute: parseInt(minutes, 10) };
};

export const generateWholeDaySlots = (startTimeObj: Date, endTimeObj: Date) => {
  const slots = [];
  
  const formatTime = (h: number, m: number): string => {
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12; // Handle 12-hour format
    const min = m < 10 ? `0${m}` : m; // Add leading zero to minutes if needed
    return `${hour}:${min} ${period}`;
  };

  while (startTimeObj < endTimeObj) {
    const hours = startTimeObj.getHours();
    const minutes = startTimeObj.getMinutes();

    // Push slot in the required format
    slots.push({
      time: formatTime(hours, minutes),
      status: "Not Booked", // Default status
      isAvailable: true, // Default availability
    });

    // Increment by 30 minutes
    startTimeObj.setMinutes(startTimeObj.getMinutes() + 30);
  }

  return slots;
};