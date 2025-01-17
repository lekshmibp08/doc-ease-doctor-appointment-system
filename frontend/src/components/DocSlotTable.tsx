import { useState, useEffect } from "react";
import "../styles/responsive-table.css";
import DatePicker from "react-datepicker";
import axios from "../services/axiosConfig";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit } from "react-icons/fa"; // Importing edit icon from react-icons
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
  const [slots, setSlots] = useState<Slot[]>([]); // store filtered slots
  const [allSlots, setAllSlots] = useState<Slot[]>([]); //store all slots
  const [loading, setLoading] = useState(false);
  const [slotId, setSlotId] = useState("");
  const [editSlotId, setEditSlotId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState("");

  // Fetch slots from backend
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
      setAllSlots(response.data.slotDataAll);
      setSlotId(response.data.slotId);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
      setAllSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, timePeriod]);

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  const handleStatusChange = async (timeSlotId: string, status: string) => {
    try {
      const response = await axios.put("/api/doctors/slots/update-status", {
        slotId,
        timeSlotId,
        status,
      });

      const isAvailable = response.data.updation;

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

  const handleEditIconClick = (slot: Slot) => {
    setEditSlotId(slot._id);
    setNewTime(slot.time);
  };

  const handleSaveNewTime = async () => {
    // Regex for validating time in HH:mm AM/PM format
    const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  
    if (!newTime.match(timeFormatRegex)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Time Format',
        text: 'Please enter the time in the format HH:mm AM/PM (e.g., 08:30 AM).',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    // Check if the entered time already exists
    const isDuplicateTime = allSlots.some((slot) => slot.time === newTime);
    if (isDuplicateTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Time',
        text: 'The entered time slot already exists. Please choose a different time.',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    try {
      await axios.put("/api/doctors/slots/update-time", {
        slotId,
        timeSlotId: editSlotId,
        newTime,
      });
  
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === editSlotId ? { ...slot, time: newTime } : slot
        )
      );
      setAllSlots((prevAllSlots) =>
        prevAllSlots.map((slot) =>
          slot._id === editSlotId ? { ...slot, time: newTime } : slot
        )
      );
      setEditSlotId(null); 
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Successfully updated time slot.',
        confirmButtonText: 'Okay',
      });
    } catch (error) {
      console.error("Error updating slot time:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update slot time. Please try again.',
        confirmButtonText: 'Okay',
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
              onClick={() => handleTimePeriodChange(period)}
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
                <tr
                  key={slot._id}
                  className={`text-center ${
                    slot.status === "Not Booked" ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td data-label="Slots" className="py-3 px-4">
                    {editSlotId === slot._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="border rounded-md px-2 py-1"
                        />
                        <button
                          onClick={handleSaveNewTime}
                          className="text-green-500 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditSlotId(null)}
                          className="text-red-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {slot.time}
                        {slot.status === "Not Booked" && (
                          <FaEdit
                            className="text-blue-500 cursor-pointer hover:scale-110"
                            title="Edit slot time"
                            onClick={() => handleEditIconClick(slot)}
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td
                    data-label="Status"
                    className={`py-3 px-4 ${
                      slot.status === "Not Booked"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {slot.status}
                  </td>
                  <td data-label="Update Status" className="py-3 px-4">
                    <select
                      className={`py-2 px-3 rounded-md ${
                        slot.isAvailable
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      value={slot.isAvailable ? "Available" : "Unavailable"}
                      onChange={(e) =>
                        handleStatusChange(slot._id, e.target.value)
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
          <p className="text-center p-6">No slots available for this period.</p>
        )}
      </div>
    </div>
  );
};

export default DocSlotTable;
