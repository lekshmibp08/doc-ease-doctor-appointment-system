import { useState, useEffect } from "react";
import { Slot } from "../types/interfaces";
import "../styles/responsive-table.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import GenerateSlotsModal from "./GenerateSlotsModal";
import { 
  fetchDoctorSlots,
  generateDoctorSlots,
  updateSlotStatus, 
} from '../services/api/doctorApi'



const DocSlotTable = ({ doctorId }: { doctorId: string }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("Morning");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [slotIdFetched, setSlotIdFetched] = useState<string | null>(null);
  const [repeat, setRepeat] = useState("Weekly");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [dayTimeSettings, setDayTimeSettings] = useState<{ [key: string]: { startTime: string; endTime: string } }>({});
  const [durationError, setDurationError] = useState('');
  const [timeErrors, setTimeErrors] = useState<{ [key: string]: string }>({});

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const date = selectedDate.toISOString().split("T")[0];
      const { slotDataFiltered, slotId } = await fetchDoctorSlots(doctorId, date, timePeriod);

      setSlots(slotDataFiltered);
      setSlotIdFetched(slotId);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, timePeriod]);

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );

    if (!dayTimeSettings[day]) {
      setDayTimeSettings((prev) => ({
        ...prev,
        [day]: { startTime: "", endTime: "" },
      }));
    }
  };

  const handleTimeChange = (day: string, field: "startTime" | "endTime", value: string) => {
    setDayTimeSettings((prev: { [key: string]: { startTime: string; endTime: string } }) => {
      const currentDayTime = prev[day] || { startTime: "", endTime: "" };
      return {
        ...prev,
        [day]: {
          ...currentDayTime,
          [field]: value,
        },
      };
    });

    const updatedSettings = {
      ...dayTimeSettings,
      [day]: { ...dayTimeSettings[day], [field]: value },
    };

    const { startTime, endTime } = updatedSettings[day];

    if (startTime && endTime && startTime >= endTime) {
      setTimeErrors((prevErrors) => ({
        ...prevErrors,
        [day]: "Start time must be before end time.",
      }));
    } else {
      setTimeErrors((prevErrors) => ({
        ...prevErrors,
        [day]: "",
      }));
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < 1 || value > 60) {
      setDurationError("Duration should be between 1 and 60 minutes.");
    } else {
      setDurationError("");
    }

    setDuration(value);
  };

  const handleGenerateSlots = async () => {
    if (!duration || selectedDays.some((day) => !dayTimeSettings[day]?.startTime || !dayTimeSettings[day]?.endTime)) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields for each selected day.",
        confirmButtonText: "Okay",
      });
      return;
    }

    try {
      const startDate = selectedDate.toISOString().split("T")[0];
      const availableDays = selectedDays.map((day) => ({
        day: day.slice(0, 2).toUpperCase(),
        startTime: dayTimeSettings[day].startTime,
        endTime: dayTimeSettings[day].endTime,
      }));

      const res = await generateDoctorSlots({
        doctorId,
        startDate,
        repeat,
        availableDays,
        duration,
      });

      Swal.fire({
        icon: "success",
        title: "Slots Generated",
        text: res.message,
        confirmButtonText: "Okay",
      });

      setShowGenerateModal(false);
      fetchSlots();
    } catch (error) {
      console.error("Error generating slots:", error);
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text: "Failed to generate slots. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleAvailabilityChange = async (timeSlotId: string, status: string) => {
    try {
      if (slotIdFetched === null) {
        console.error("Slot ID is null");
        return;
      }
      const isAvailable = await updateSlotStatus(slotIdFetched, timeSlotId, status);

      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === timeSlotId ? { ...slot, isAvailable } : slot
        )
      );
    } catch (error) {
      console.error("Error updating slot status:", error);
      alert("Failed to update slot status. Please try again.");
    }
  };



  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <label className="font-semibold">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            minDate={new Date()}
            className="border rounded-md px-4 py-2"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {["Morning", "Afternoon", "Evening"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-md ${
                timePeriod === period ? "bg-green-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-md overflow-hidden">
        {loading ? (
          <p className="text-center p-6">Loading slots...</p>
        ) : slots.length > 0 ? (
          <table className="w-full table-auto">
            <thead className="bg-customTeal text-white">
              <tr>
                <th className="py-3 px-4">Slots</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Update Availability</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="text-center bg-white">
                  <td className="py-3 px-4">{slot.time}</td>
                  <td
                    className={`py-3 px-4 ${
                      slot.status === "Not Booked"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {slot.status}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      className={`py-2 px-3 rounded-md ${
                        slot.isAvailable
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      value={slot.isAvailable ? "Available" : "Unavailable"}
                      onChange={(e) =>
                        handleAvailabilityChange(slot._id, e.target.value)
                      }
                    >
                      <option
                        className="bg-green-500 text-white"
                        value="Available"
                      >
                        Available
                      </option>
                      <option
                        className="bg-red-500 text-white"
                        value="Unavailable"
                      >
                        Unavailable
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center">
            {slotIdFetched ? (
              <p className="mb-4">No slots available for the time period.</p>
            ) : (
              <>
                <p className="mb-4">No slots generated yet.</p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowGenerateModal(true)}
                >
                  Generate Slots
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <GenerateSlotsModal
        showGenerateModal={showGenerateModal}
        setShowGenerateModal={setShowGenerateModal}
        repeat={repeat}
        setRepeat={setRepeat}
        duration={duration}
        handleDurationChange={handleDurationChange}
        durationError={durationError}
        selectedDays={selectedDays}
        toggleDaySelection={toggleDaySelection}
        dayTimeSettings={dayTimeSettings}
        handleTimeChange={handleTimeChange}
        timeErrors={timeErrors}
        handleGenerateSlots={handleGenerateSlots}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
};

export default DocSlotTable;