import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { IAppointment } from '@/types/interfaces';
import {
  fetchDoctorSlots,
  fetchDoctorModes,
  rescheduleAppointment
} from '../services/api/userApi'


interface Slot {
  _id: string;
  time: string;
  status: string;
  isAvailable: boolean;
}

interface RescheduleModalProps {
  doctorId?: string;
  appointmentId: string;
  onClose: () => void;
  onRescheduleSuccess: (updatedAppointment: IAppointment) => void;
}

const RescheduleModal = ({ doctorId, appointmentId, onClose, onRescheduleSuccess }: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visitType, setVisitType] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [modesOfConsultation, setModesOfConsultation] = useState<string[]>([]);


  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const date = selectedDate.toISOString().split("T")[0]
        const { timeSlots, slotId } = await fetchDoctorSlots(doctorId, date)
        setSlots(timeSlots || []);
        setSlotId(slotId);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, doctorId]);
    

    const filterSlotsByTime = (timeOfDay: 'morning' | 'afternoon' | 'evening') => {
      return slots.filter((slot) => {
        const [time, period] = slot.time.split(' ');
        const [hours] = time.split(':').map(Number);
        
        // Convert 12-hour time to 24-hour time for easier comparison
        const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
        
        if (timeOfDay === 'morning') return hour24 >= 7 && hour24 < 12; 
        if (timeOfDay === 'afternoon') return hour24 >= 12 && hour24 < 17; 
        if (timeOfDay === 'evening') return hour24 >= 17 && hour24 <= 20; 
        return false;
      });
    };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) return;
      try {
        const modes = await fetchDoctorModes(doctorId)
        setModesOfConsultation(modes)
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorDetails();
  }, [doctorId]);  


  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleReschedule = async () => {
    if (!selectedSlot || !visitType) {
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select a time slot and consultation type.',
        confirmButtonText: 'Okay',
      });
      return;
    }

    try {
      const res = await rescheduleAppointment({
        appointmentId,
        date: selectedDate,
        slotId,
        selectedSlot,
        timeSlotId: selectedSlot._id,
        time: selectedSlot.time,
        modeOfVisit: visitType,
      })
      Swal.fire("Success!", "Appointment rescheduled successfully", "success");
      onRescheduleSuccess(res.updatedAppointment);
      onClose();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      Swal.fire({
        icon: 'error',
        title: 'Reschedule Failed',
        text: 'Something went wrong. Please try again later.',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-customBgLight flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
            <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
            <div className="flex items-center gap-4 mb-6">
                <label htmlFor="appointmentDate" className="font-semibold">
                  Select a Date:
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date as Date)}
                  minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Disable today's date
                  dateFormat="yyyy-MM-dd"
                  className="border rounded-md px-3 py-2"
                  placeholderText="Select a date"
                />
            </div>
            
            {/* Loading state */}
            {loading ? (
              <div className="text-center font-semibold text-blue-500">Loading slots...</div>
            ) : slots.length === 0 ? (
              <div className="text-center font-semibold text-red-500">No slots available for this date</div>
            ) : (
              <>
              {/* Morning Slots */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Morning</h2>
                <div className="flex flex-wrap gap-4">
                  {filterSlotsByTime('morning').map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotClick(slot)}
                      className={`px-3 py-1 rounded-md border ${
                        selectedSlot?.time === slot.time
                          ? 'bg-customTeal text-white'
                          : 'bg-white text-customTeal'
                      } ${
                        slot.status === 'Booked' || !slot.isAvailable
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                          : ''
                      }`}
                      disabled={!slot.isAvailable || slot.status === 'Booked'}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Afternoon Slots */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Afternoon</h2>
                <div className="flex flex-wrap gap-4">
                  {filterSlotsByTime('afternoon').map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotClick(slot)}
                      className={`px-3 py-1 rounded-md border ${
                        selectedSlot?.time === slot.time
                          ? 'bg-customTeal text-white'
                          : 'bg-white text-customTeal'
                      } ${
                        slot.status === 'Booked' || !slot.isAvailable
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                          : ''
                      }`}
                      disabled={!slot.isAvailable || slot.status === 'Booked'}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Evening Slots */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Evening</h2>
                <div className="flex flex-wrap gap-4">
                  {filterSlotsByTime('evening').map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotClick(slot)}
                      className={`px-3 py-1 rounded-md border ${
                        selectedSlot?.time === slot.time
                          ? 'bg-customTeal text-white'
                          : 'bg-white text-customTeal'
                      } ${
                        slot.status === 'Booked' || !slot.isAvailable
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                          : ''
                      }`}
                      disabled={!slot.isAvailable || slot.status === 'Booked'}
                    >
                      {slot.time}
                    </button>
                  ))}
          </div>
        </div>          
        </>
      )}

      {/* Consultation Modes */}
      <div className="mt-4">
        <div className="flex flex-nowrap gap-16">
          {modesOfConsultation.map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visitType"
                value={mode}
                checked={visitType === mode}
                onChange={(e) => setVisitType(e.target.value)}
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
      </div> 
      <div className='flex gap-10 justify-self-center'>
        <button 
        onClick={handleReschedule}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold w-32"
        >
            Reschedule            
        </button>
        <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold w-32">
            Cancel            
        </button>
      </div>      
    </div>
    </div>
    
  );
};

export default RescheduleModal;
