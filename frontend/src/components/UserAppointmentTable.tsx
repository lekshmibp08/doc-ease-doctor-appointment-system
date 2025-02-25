import React, { useEffect, useState } from 'react';
import axios from '../services/axiosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { IAppointment } from '../types/interfaces';
import { format } from "date-fns";
import PrescriptionView from './PrescriptionView';
import { Star } from "lucide-react";
import ReviewForm from './ReviewForm';
import Swal from 'sweetalert2';
import RescheduleModal from './RescheduleModal';

const UserAppointmentTable: React.FC = () => {

  const { currentUser } = useSelector((state: RootState) => state.userAuth);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [showPrescription, setShowPrescription] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<IAppointment | null>(null)
  const [showRescheduleModel, setShowRescheduleModel] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<IAppointment | null>(null);


  const fetchAppointments = async () => {
    const userId = currentUser?._id;
    
    try {
        const response = await axios.get(`/api/users/appointments/${userId}`);        
        setAppointments(response.data.appointments); 
    } catch (error) {
        console.error(error);        
    }
  };
  useEffect(() => {
    fetchAppointments();    
  },[currentUser?._id]);

  const handleCancelOrReschedule = async (appointment: IAppointment) => {
    const result = await Swal.fire({
      title: "What do you want to do?",
      text: "You can either cancel the appointment or reschedule it.",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Cancel Appointment",
      denyButtonText: "Reschedule",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`/api/users/appointments/${appointment._id}`);
        setAppointments((prev) => 
          prev.map((app) => 
            app._id === appointment._id ? { ...appointment, isCancelled: true } : appointment
          )
        );

        Swal.fire({
          title: "Cancelled!",
          text: `${response.data.message}\nRefund Transaction ID: ${response.data.refundTransactionId}`,
          icon: "success",
        });

      } catch (error: any) {
        Swal.fire("Error!", error.message, "error");
      }
    } else if (result.isDenied) {
      setSelectedAppointmentForReschedule(appointment)
      setShowRescheduleModel(true);
    }
    
  }

  const handleRescheduleSubmit = (updatedAppointment: IAppointment) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app._id === updatedAppointment._id ? updatedAppointment : app
      )
    );
    setShowRescheduleModel(false);
  };

  const handlePrescription = async (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowPrescription(true);
  }

  const handleRateUs = (appointment: IAppointment) => {
    setSelectedAppointmentForReview(appointment)
    setShowReviewForm(true)
  }

    const handleReviewSubmit = () => {
    fetchAppointments()
  }

  return (
    <div className="p-4 mx-auto max-w-6xl bg-lightTeal rounded-md">
      {appointments.length > 0 ? (
        // Show table if appointments are available
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-customTeal text-white">
              <tr>
                <th className="p-2 border border-gray-300">Sl. No</th>
                <th className="p-2 border border-gray-300">Doctor<br />Name</th>
                <th className="p-2 border border-gray-300">Booking<br />Date</th>
                <th className="p-2 border border-gray-300">Slot</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border border-gray-300">Cancel</th>
                <th className="p-2 border border-gray-300">Rate Now</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } text-center`}
                >
                  <td className="p-2 border border-gray-300">{index + 1}</td>
                  <td className="p-2 border border-gray-300">
                    {(appointment.doctorId as any).fullName}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {format(new Date(appointment.date), "dd MMM yyyy")} <br />
                    {format(new Date(appointment.date), "EEEE")}
                  </td>
                  <td className="p-2 border border-gray-300">{appointment.time}</td>
                  <td className={`p-2 border border-gray-300 ${appointment.isCompleted ? "text-green-700" : "text-red-600"}`}>
                    {appointment.isCompleted ? "Completed" : "Pending"} <br />
                    {appointment.isCompleted &&
                      <button
                        onClick={() => handlePrescription(appointment._id)}
                        className="text-blue-600 cursor-pointer 
                        bg-transparent border-none text-sm hover:underline"
                      >                        
                        Open Prescription                       
                      </button>
                    }
                  </td>
                  { /*
                  <td className="p-2 border border-gray-300">
                    <button className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs md:text-sm">
                      Open
                    </button>
                  </td>
                  */ }
                  <td className="p-2 border border-gray-300">
                    {appointment.isCancelled ? (
                      <span className="text-red-500 font-semibold">Cancelled</span>
                    ) : (
                      <button
                        className={`px-4 py-1 rounded-md text-xs md:text-sm ${
                          new Date(appointment.date) > new Date()
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleCancelOrReschedule(appointment)}
                        disabled={new Date(appointment.date) <= new Date()}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                  <td className="p-2 border border-gray-300 items-center">
                <button
                  className={`flex justify-center px-3 py-1 rounded-md text-xs md:text-sm ${
                    appointment.isCompleted
                      ? "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!appointment.isCompleted}
                  onClick={() => handleRateUs(appointment)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  {appointment.isReviewed ? "Edit Review" : "Add Review"}
                </button>
              </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Show message if no appointments are available
        <div className="text-center text-gray-500 p-6">
          <p className="text-lg font-semibold">No appointments taken</p>
        </div>
      )}
      {showPrescription && selectedAppointmentId && (
        <PrescriptionView
          appointmentId={selectedAppointmentId}
          onClose={() => {
            setShowPrescription(false)
            setSelectedAppointmentId(null)
          }}
        />
      )}

      {showReviewForm && selectedAppointmentForReview && currentUser && (
        <ReviewForm
          appointmentId={selectedAppointmentForReview._id}
          userId={currentUser?._id}
          doctorId={(selectedAppointmentForReview.doctorId as any)._id}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {showRescheduleModel && selectedAppointmentForReschedule && (
        <RescheduleModal
          doctorId={(selectedAppointmentForReschedule.doctorId as any)._id}
          appointmentId={selectedAppointmentForReschedule._id}
          onClose={() => setShowRescheduleModel(false)}
          onRescheduleSuccess={handleRescheduleSubmit}
        />
      )}

    </div>
  );
};

export default UserAppointmentTable;
