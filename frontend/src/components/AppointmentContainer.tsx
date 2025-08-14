 import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import DateSelector from './appointmentBooking/DateSelector';
import TimeSlotSection from './appointmentBooking/TimeSlotSection';
import ConsultationModeSelector from './appointmentBooking/ConsultationModeSelector';
import PaymentButton from './appointmentBooking/PaymentButton';
import { Slot, AppointmentContainerProps } from '../types/interfaces';
import { getDoctorSlots } from '../services/api/userApi'
import Swal from 'sweetalert2';
import BookingSocketService from '../services/socketService/bookingSocketService';

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
  const [lockedSlotIds, setLockedSlotIds] = useState<Set<string>>(new Set());
  const prevSelectedSlotRef = useRef<Slot | null>(null);

  const { currentUser } = useSelector((state: RootState) => state.userAuth);
  const socketService = useMemo(() => BookingSocketService.getInstance(), []);
  const myLockRef = useRef<{ slotId: string; date: string } | null>(null);

  const dateStr = useMemo(() => selectedDate.toISOString().split("T")[0], [selectedDate]);

  const fetchSlots = useCallback( async () => {
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
  }, [doctorId, dateStr])

  // Connect socket when user ready
  useEffect(() => {
    if (!currentUser?._id) return;
    socketService.connect(currentUser._id);
    return () => socketService.offAll();
  }, [currentUser?._id, socketService]);

  // Join room and attach listeners for this date/doctor
  useEffect(() => {
    if (!currentUser?._id) return;
    socketService.joinRoom(doctorId, dateStr);

    const onLocked = (d: { doctorId: string; date: string; slotId: string }) => {
      if (d.doctorId === doctorId && d.date === dateStr) {
        setLockedSlotIds(prev => new Set(prev).add(d.slotId));
        // If I had it selected (but someone else locked earlier), clear it
        setSelectedSlot(prev => (prev?._id === d.slotId ? undefined : prev));
      }
    };
    const onUnlocked = (d: { doctorId: string; date: string; slotId: string }) => {
      if (d.doctorId === doctorId && d.date === dateStr) {
        setLockedSlotIds(prev => {
          const next = new Set(prev);
          next.delete(d.slotId);
          return next;
        });
      }
    };
    const onBooked = (d: { doctorId: string; date: string; slotId: string }) => {
      if (d.doctorId === doctorId && d.date === dateStr) {
        // Remove lock and reflect permanent unavailability
        setLockedSlotIds(prev => {
          const next = new Set(prev);
          next.delete(d.slotId);
          return next;
        });
        setSlots(prev => prev.map(s => (s._id === d.slotId ? { ...s, isAvailable: false, status: "Booked" as any } : s)));
        setSelectedSlot(prev => (prev?._id === d.slotId ? undefined : prev));
      }
    };

    socketService.onLocked(onLocked);
    socketService.onUnlocked(onUnlocked);
    socketService.onBooked(onBooked);

    return () => {
      // Leave room and release my lock (if any)
      if (myLockRef.current?.slotId) {
        socketService.releaseLock({ doctorId, date: dateStr, slotId: myLockRef.current.slotId });
        myLockRef.current = null;
      }
      socketService.leaveRoom(doctorId, dateStr);
      socketService.offAll();
      setLockedSlotIds(new Set());
    };
  }, [doctorId, dateStr, currentUser?._id, socketService]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

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


  const handleSlotClick = async (slot: Slot) => {
    if (!currentUser?._id) {
      Swal.fire({ icon: "info", title: "Please login to continue" });
      return;
    }
    if (!slot.isAvailable || slot.status === "Booked" || lockedSlotIds.has(slot._id)) return;

    prevSelectedSlotRef.current = selectedSlot || null;

    // If I already locked a different slot, release first
    if (myLockRef.current?.slotId && myLockRef.current.slotId !== slot._id) {
      socketService.releaseLock({ doctorId, date: dateStr, slotId: myLockRef.current.slotId });
      myLockRef.current = null;
    }

    const ack = await socketService.requestLock({
      doctorId,
      date: dateStr,
      slotId: slot._id,
      userId: currentUser._id,
    });

    if (ack.ok) {
      setLockedSlotIds(prev => new Set(prev).add(slot._id));
      myLockRef.current = { slotId: slot._id, date: dateStr };
      setSelectedSlot(slot);
    } else {
      Swal.fire({ icon: "warning", title: "Slot just got picked", text: "Please select a different time." });
      fetchSlots();
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const handleModeChange = (mode: string) => {
    setVisitType(mode)
  }

  // From PaymentButton: success
  const onBookingConfirmed = () => {
    if (!selectedSlot) return;
    socketService.announceBooked({ doctorId, date: dateStr, slotId: selectedSlot._id });
    // Local housekeeping
    myLockRef.current = null;
    setLockedSlotIds(prev => { const next = new Set(prev); next.delete(selectedSlot._id); return next; });
  };

  // From PaymentButton: dismissed/failure
  const onPaymentAborted = () => {
    if (!myLockRef.current?.slotId) return;
    
    const lockedSlotId = myLockRef.current.slotId;

    socketService.releaseLock({ doctorId, date: dateStr, slotId: myLockRef.current.slotId });
    
    setLockedSlotIds(prev => { 
      const next = new Set(prev); 
      next.delete(lockedSlotId); 
      return next; 
    });
      
    myLockRef.current = null;
    if (prevSelectedSlotRef.current) {
    setSelectedSlot(prevSelectedSlotRef.current);
    setSlotId(prevSelectedSlotRef.current._id);
  }
    
  };

  // Release lock when unmounting component
  useEffect(() => {
    return () => {      
      if (myLockRef.current?.slotId) {        
        socketService.releaseLock({ doctorId, date: dateStr, slotId: myLockRef.current.slotId });
        myLockRef.current = null;
      }
    };
  }, []);


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
            lockedSlotIds={lockedSlotIds}
          />
          <TimeSlotSection
            title="Afternoon"
            slots={filterSlotsByTime("afternoon")}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            lockedSlotIds={lockedSlotIds}
          />
          <TimeSlotSection
            title="Evening"
            slots={filterSlotsByTime("evening")}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            lockedSlotIds={lockedSlotIds}
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
        doctorId={doctorId} 
        slotId={slotId}
        fee={fee}
        currentUser={currentUser}
        onBookingConfirmed={onBookingConfirmed}
        onPaymentAborted={onPaymentAborted}
      />
    </div>
  )
}
    
export default AppointmentContainer;
