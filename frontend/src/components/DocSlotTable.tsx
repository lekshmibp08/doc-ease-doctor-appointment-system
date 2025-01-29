import { useState, useEffect } from "react";
import "../styles/responsive-table.css";
import DatePicker from "react-datepicker";
import axios from "../services/axiosConfig";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

interface Slot {
  _id: string;
  time: string;
  status: string;
  isAvailable: boolean;
}

const DocSlotTable = ({ doctorId }: { doctorId: string }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("Morning");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [slotIdFetched, setSlotIdFetched] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/doctors/slots", {
        params: {
          doctorId,
          date: selectedDate.toISOString().split("T")[0],
          timePeriod,
        },
      });

      setSlots(response.data.slotDataFiltered);
      setSlotIdFetched(response.data.slotId);
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

  const handleGenerateSlots = async () => {
    const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (!startTime.match(timeFormatRegex) || !endTime.match(timeFormatRegex)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Time Format",
        text: "Please enter the time in the format HH:mm AM/PM (e.g., 08:30 AM).",
        confirmButtonText: "Okay",
      });
      return;
    }

    const convertTo24HourFormat = (time: string) => {
      const [hours, minutes] = time.split(/[: ]/);
      const isPM = time.includes("PM");
      let hour = parseInt(hours);
      hour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;
      return new Date(1970, 0, 1, hour, parseInt(minutes));
    };

    const startTimeDate = convertTo24HourFormat(startTime);
    const endTimeDate = convertTo24HourFormat(endTime);

    if (endTimeDate <= startTimeDate) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Time Range",
        text: "Ending time must be later than starting time.",
        confirmButtonText: "Okay",
      });
      return;
    }

    try {
      await axios.post("/api/doctors/generate-slots", {
        doctorId,
        date: selectedDate.toISOString().split("T")[0],
        startTime,
        endTime,
      });

      Swal.fire({
        icon: "success",
        title: "Slots Generated",
        text: "New slots have been successfully created!",
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
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {["Morning", "Afternoon", "Evening"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-md ${
                timePeriod === period
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-black"
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
                <th className="py-3 px-4">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="text-center bg-white">
                  <td className="py-3 px-4">{slot.time}</td>
                  <td className="py-3 px-4">{slot.status}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => console.log("Update Status")}
                    >
                      Update Status
                    </button>
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

      {showGenerateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-4">Generate Slots</h3>
            <div className="mb-4">
              <label className="block mb-2">Start Time:</label>
              <input
                type="text"
                placeholder="HH:mm AM/PM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">End Time:</label>
              <input
                type="text"
                placeholder="HH:mm AM/PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleGenerateSlots}
              >
                Submit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocSlotTable;
