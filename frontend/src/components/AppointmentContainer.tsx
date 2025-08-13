 import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import DateSelector from './appointmentBooking/DateSelector';
import TimeSlotSection from './appointmentBooking/TimeSlotSection';
import ConsultationModeSelector from './appointmentBooking/ConsultationModeSelector';
import PaymentButton from './appointmentBooking/PaymentButton';
import { Slot, AppointmentContainerProps } from '../types/interfaces';
import { 
  getDoctorSlots, 
} from '../services/api/userApi'

declare global {
  interface Window {
    Razorpay: any;
  }
}


const AppointmentContainer = ({
  doctorId,
  modesOfConsultation,
  fee,
}: AppointmentContainerProps) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [visitType, setVisitType] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot>();
  const [slots, setSlots] = useState<Slot[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [slotId, setSlotId] = useState<string>('')
  const { currentUser } = useSelector((state: RootState) => state.userAuth);

  const fetchSlots = async () => {
    setLoading(true); 
    try {
      const data = await getDoctorSlots(doctorId, selectedDate.toISOString().split("T")[0]);
  
      setLoading(false); 
  
      if (Object.keys(data).length === 0 || !data.timeSlots) {
        setSlots([]); 
        setSlotId(''); 
      } else {
        setSlots(data.timeSlots);
        setSlotId(data.slotId);        
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]); 
      setLoading(false);
    }
  };

  useEffect(() => {
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
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const handleModeChange = (mode: string) => {
    setVisitType(mode)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-customBgLight">
      <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />

      {loading ? (
        <div className="text-center font-semibold text-blue-500">Loading slots...</div>
      ) : slots.length === 0 ? (
        <div className="text-center font-semibold text-red-500">No slots available for this date</div>
      ) : (
        <>
          <TimeSlotSection
            title="Morning"
            slots={filterSlotsByTime("morning")}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
          />
          <TimeSlotSection
            title="Afternoon"
            slots={filterSlotsByTime("afternoon")}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
          />
          <TimeSlotSection
            title="Evening"
            slots={filterSlotsByTime("evening")}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
          />
        </>
      )}

      <ConsultationModeSelector
        modesOfConsultation={modesOfConsultation}
        visitType={visitType}
        onModeChange={handleModeChange}
      />

      <PaymentButton
        selectedSlot={selectedSlot}
        visitType={visitType}
        selectedDate={selectedDate}
        doctorId={doctorId || ""} 
        slotId={slotId}
        fee={fee}
        currentUser={currentUser}
      />
    </div>
  )
}
    
export default AppointmentContainer;
