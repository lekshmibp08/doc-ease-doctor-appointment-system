import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "../services/axiosConfig";
import "react-datepicker/dist/react-datepicker.css";

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
  const [slotId, setSlotId] = useState('');

  console.log("TIME PERIOD1: ", timePeriod);
  
  
  // Fetch slots from backend
  const fetchSlots = async () => {
    setLoading(true);
    console.log("TIME PERIOD2: ", timePeriod);
    try {
      const response = await axios.get("/api/doctors/slots", {
        params: {
          doctorId,
          date: selectedDate.toISOString().split("T")[0],
          timePeriod,
        },
      });

      console.log("RESPONSE: ", response.data);
      
      setSlots(response.data.slotData);
      setSlotId(response.data.slotId)
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


  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  const handleStatusChange = async (timeSlotId: string, status: string) => {
    console.log("SLOT ID: ", slotId);
    
    try {
      const response = await axios.put("/api/doctors/slots/update-status", {
        slotId,
        timeSlotId,
        status
      });
  
      console.log("Slot status updated:", response.data.updation);
      const isAvailable = response.data.updation
  
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
    <div className="p-6">
      {/* Header with Calendar and Time Period Filters */}
      <div className="flex items-center justify-between mb-6">
        {/* Date Picker */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            minDate={new Date()} // Disable past dates
            className="border rounded-md px-4 py-2"
          />
        </div>

        {/* Time Period Filters */}
        <div className="flex gap-4">
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

      {/* Slot Management Table */}
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
                      onChange={(e) => handleStatusChange(slot._id, e.target.value)}                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
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
