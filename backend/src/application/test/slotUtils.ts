
export const MORNING_SLOTS = [
    "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", 
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"
  ];
  
  export const AFTERNOON_SLOTS = [
    "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];
  
  export const EVENING_SLOTS = [
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", 
    "07:30 PM", "08:00 PM"
  ];
  
  // Helper function to generate time slots for the entire day
  export const generateWholeDaySlots = () => {
    return [
      ...MORNING_SLOTS.map(time => ({ time, status: "Not Booked", isAvailable: true })),
      ...AFTERNOON_SLOTS.map(time => ({ time, status: "Not Booked", isAvailable: true })),
      ...EVENING_SLOTS.map(time => ({ time, status: "Not Booked", isAvailable: true }))
    ];
  };
  