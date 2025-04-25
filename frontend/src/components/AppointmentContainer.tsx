 
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { useNavigate } from 'react-router-dom';
import { Slot, AppointmentContainerProps } from '../types/interfaces';
import { 
  getDoctorSlots, 
  createOrder, 
  bookAppointment 
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
  const [slots, setSlots] = useState<Slot[]>([]); // To store the fetched slots
  const [loading, setLoading] = useState<boolean>(false);
  const [slotId, setSlotId] = useState<string>('')
  const { currentUser } = useSelector((state: RootState) => state.userAuth);

  const navigate = useNavigate();

  const fetchSlots = async () => {
    setLoading(true); 
    try {
      const data = await getDoctorSlots(doctorId, selectedDate.toISOString().split("T")[0]);
  
      setLoading(false); 
  
      // Check if the response data is empty
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

  //Pay Now Button Handler
  const handlePayNow = async () => {
    
    if (!selectedSlot) {
      Swal.fire({
        icon: 'warning',
        title: 'No Slot Selected',
        text: 'Please select a time slot before proceeding.',
        confirmButtonText: 'Okay',
      });
      return;
    }
    if (!visitType) {
      Swal.fire({
        icon: 'warning',
        title: 'No Mode Selected',
        text: 'Please select consultation type before proceeding.',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    try {
      const totalAmount = fee + 50;
  
      // Step 1: Create Order
      const order = await createOrder(totalAmount);
  
      // Step 2: Configure Razorpay
      const options = {
        key: 'rzp_test_wyMPk3or5BIJn5', 
        amount: order.amount,
        currency: order.currency,
        name: 'DocEase App',
        description: `Appointment Booking for ${format(selectedDate, 'yyyy-MM-dd')}`,
        order_id: order.id,
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: `Payment ID: ${response.razorpay_payment_id}`,
            confirmButtonText: 'Okay',
          });
  
          try {
            // Save Appointment Details
            const appointmentData = {
              doctorId: doctorId,
              userId: currentUser?._id,
              date: selectedDate,
              slotId,
              selectedSlot,
              timeSlotId: selectedSlot._id,
              time: selectedSlot.time,
              modeOfVisit: visitType,
              amount: totalAmount,
              paymentId: response.razorpay_payment_id,
            };
            const res = await bookAppointment(appointmentData);
            
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful',
              html: `
              <h3>Your appointment has been successfully created!</h3>
              <p><strong>Date:</strong> ${format(new Date(res.newAppoinment.date), 'dd MMM yyyy, EEEE')}</p>
              <p><strong>Time:</strong> ${res.newAppoinment.time}</p>
              <div class="mt-4">
                <button id="go-home" class="swal2-confirm swal2-styled">Go to Home</button>
                <button id="show-appointments" class="swal2-confirm swal2-styled">Show Appointments</button>
              </div>
            `,              
            showConfirmButton: false,
            didRender: () => {
              // Attach custom button handlers
              const goHomeButton = document.getElementById('go-home');
              const showAppointmentsButton = document.getElementById('show-appointments');
    
              goHomeButton?.addEventListener('click', () => {
                Swal.close();
                navigate('/');
              });

              showAppointmentsButton?.addEventListener('click', () => {
                Swal.close();
                navigate(`/appointments`);
              });
            },            
          });
            
          } catch (error) {
            console.error("Error creating appointment:", error);
            Swal.fire({
              icon: "error",
              title: "Appointment Error",
              text: "There was an error while creating your appointment. Please try again later.",
              confirmButtonText: "Okay",
            });            
          }
        },
        prefill: {
          name: currentUser?.fullName,
          email: currentUser?.email,
          contact: currentUser?.mobileNumber,
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      // Step 3: Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
  
      // Step 4: Handle Payment Failure
      razorpay.on('payment.failed', (response: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          html: `
            <p><strong>Reason:</strong> ${response.error.reason}</p>
            <p><strong>Description:</strong> ${response.error.description}</p>
            <p><strong>Code:</strong> ${response.error.code}</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Retry',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            razorpay.open(); // Retry payment with the same order ID
          }
        });
  
        console.error('Payment failed:', response.error);
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'There was an error while processing your payment. Please try again later.',
        confirmButtonText: 'Okay',
      });
    }
  };  

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-customBgLight">
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

      {/* Pay Now Button */}
      <button
        onClick={handlePayNow}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold"
      >
        Pay Now
      </button>
    </div>
  );
};

export default AppointmentContainer;
