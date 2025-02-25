/* eslint-disable prefer-const */
type TimePeriod = "Morning" | "Afternoon" | "Evening";

export const filterSlotsByPeriod = (timePeriod: TimePeriod, timeSlots: any[]) => {
    const timeRanges: Record<TimePeriod, { start: string; end: string }> = {
        Morning: { start: "07:30 AM", end: "11:30 AM" },
        Afternoon: { start: "12:00 PM", end: "04:30 PM" },
        Evening: { start: "05:00 PM", end: "08:30 PM" },
    };

    console.log("TIME PERIOD: ", timePeriod);
    console.log("TIME Slots: ", timeSlots);
    
    // Get the start and end times for the given period
    const { start, end } = timeRanges[timePeriod];

    // Function to parse time in AM/PM format to Date object
    const parseTime = (time: string) => {
        // Split time into hours, minutes and AM/PM
        const [timeString, modifier] = time.split(' ');
        let [hours, minutes] = timeString.split(':').map(Number);
        console.log(minutes);
        

        // Handle AM/PM conversion
        if (modifier === "AM" && hours === 12) {
            hours = 0; // Midnight case
        }
        if (modifier === "PM" && hours !== 12) {
            hours += 12; // Convert PM hours to 24-hour format
        }

        // Create a Date object with the adjusted time
        return new Date(1970, 0, 1, hours, minutes); // January 1, 1970
    };

    const startTime = parseTime(start);
    const endTime = parseTime(end);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    
    return timeSlots.filter(slot => {
        const slotTime = parseTime(slot.time);

        return slotTime >= startTime && slotTime <= endTime;
    });
};
