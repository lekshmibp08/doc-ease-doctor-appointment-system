 
import { useState, useEffect } from 'react';
import "../styles/responsive-table.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axios from '../services/axiosConfig';
import Pagination from './Pagination';
import { IAppointment } from '../types/interfaces';
import PrescriptionForm from '../components/PrescriptionForm';
import Swal from 'sweetalert2';


const DocAppointmentTable = ({ doctorId }: { doctorId: string }) => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [existingPrescription, setExistingPrescription] = useState<any>(undefined)

  useEffect(() => {
    const fetchAllAppointments = async () => {        
      try {
        const response = await axios.get('/api/doctors/appointments', {
            params: {
            page: currentPage,
            size: 8,
            date: selectedDate.toISOString().split("T")[0],
            doctorId: doctorId
            },
        });

        setAppointments(response.data.appointments);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchAllAppointments();
    setShowPrescriptionForm(false)
  }, [currentPage, selectedDate]);

  const handlePrescription = async (appointment: any) => {
    setSelectedAppointment(appointment)
    try {
      const response = await axios.get(`/api/doctors/prescriptions/
        ${appointment._id}`)
      setExistingPrescription(response.data.prescription);
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        setExistingPrescription(null);
      } else {
        console.error("Error fetching prescription:", error)
      }
    }
    setShowPrescriptionForm(true)
  }

  const confirmCompleteAppointment = (appointmentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this appointment as completed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Mark as Completed!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCompleteAppointment(appointmentId);
      }
    });
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await axios.put(`/api/doctors/appointments/${appointmentId}`, {
        isCompleted: true,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, isCompleted: true }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };


  return (<>
  
    <div className="p-6 bg-customBgLight">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Appointment List</h2>
        {/* Date Picker */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            //minDate={new Date()} // Disable past dates
            className="border rounded-md px-2 py-2 w-32"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>      
  
      <div className="bg-white shadow rounded-md overflow-hidden">
        {appointments.length > 0 ? (
          <table className="min-w-full border table-auto">
            <thead className="bg-customTeal text-white">
              <tr>
                <th className="p-3 text-center border">Sl. No</th>
                <th className="p-3 text-center border">Patient<br />Name</th>
                <th className="p-3 text-center border">Slot</th>
                <th className="p-3 text-center border">Consultation<br />Type</th>
                <th className="p-3 text-center border">Status</th>
                <th className="p-3 text-center border">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index: number) => (
                <tr key={appointment._id} className="hover:bg-gray-100">
                  <td data-label="Sl. No" className="p-3 border font-semibold text-center">
                    {index + 1}
                  </td>
                  <td data-label="Patient Name" className="p-3 border font-semibold">
                    {(appointment as any).userId.fullName}
                  </td>
                  <td data-label="Slot" className="p-3 border font-semibold text-center">
                    {format(new Date(appointment.date), "dd MMM yyyy")} <br />
                    {format(new Date(appointment.date), "EEEE")} <br />
                    {appointment.time}
                  </td>
                  <td data-label="Consultation Type" className="p-3 border font-semibold text-center">
                    {appointment.modeOfVisit} <br />
                  </td>
                  <td
                    data-label="Status"
                    className={`p-3 text-center border font-semibold ${
                      appointment.isCompleted ? "text-green-600" : "text-red-600"
                    }`}
                    >
                    {appointment.isCompleted ? "Success" : "Pending"} <br />
                    {appointment.isCompleted &&
                      <button
                        onClick={() => handlePrescription(appointment)}
                        className="text-blue-600 underline cursor-pointer 
                        bg-transparent border-none text-sm"
                      >                        
                        Add/Edit Prescription                       
                      </button>
                    }
                  </td>
                  <td data-label="Action" className="p-3 border font-semibold text-center">
                    {!appointment.isCompleted ? (
                      <button
                        onClick={() => confirmCompleteAppointment(appointment._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Mark as Completed
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center p-6 text-gray-500">No appointments available today.</p>
        )}
      </div>
  
      {/* Pagination */}
      {appointments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>

    {showPrescriptionForm && selectedAppointment && (
    <PrescriptionForm
      appointmentId={selectedAppointment._id}
      patientName={selectedAppointment.userId.fullName}
      age={selectedAppointment.userId.age}
      onClose={() => setShowPrescriptionForm(false)}
      existingPrescription={existingPrescription}
    />
    )}  
  </>);
};

export default DocAppointmentTable;
