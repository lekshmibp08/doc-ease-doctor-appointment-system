

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