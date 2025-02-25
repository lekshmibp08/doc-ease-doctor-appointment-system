import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { format } from "date-fns";
import Pagination from './Pagination';
import { IAppointment } from '../types/interfaces';



const AdminAppointmentTable: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllAppointments = async () => {        
      try {
        const response = await axios.get('/api/admin/appointments', {
          params: {
            page: currentPage,
            size: 8,
            search: search || "",
          },
        });        

        setAppointments(response.data.appointments);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchAllAppointments();
  }, [currentPage, search]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };


  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Appointment List</h2>
        <input
          type="text"
          placeholder="Search Doctor/Patient..."
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-center border">Sl. No</th>
              <th className="p-3 text-center border">Patient</th>
              <th className="p-3 text-center border">Practitioner</th>
              <th className="p-3 text-center border">Appointment Details</th>
              <th className="p-3 text-center border">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index:number) => (
              <tr key={appointment._id} className="hover:bg-gray-100">
                <td className="p-3 border font-semibold text-center">{ index + 1 }</td>
                <td className="p-3 border font-semibold">
                  {(appointment as any).user.fullName}
                </td>
                <td className="p-3 border font-semibold">
                {(appointment as any).doctor.fullName}
                </td>
                <td className="p-3 border font-semibold text-center">
                  {format(new Date(appointment.date), "dd MMM yyyy")} <br />
                  {format(new Date(appointment.date), "EEEE")} <br />
                  {appointment.time}

                </td>
                <td className={`p-3 text-center border font-semibold ${
                      appointment.isCompleted ? "text-green-600" : "text-red-600"
                    }`} >
                  {appointment.isCompleted? "Success" : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
            
    </div>
  );
};

export default AdminAppointmentTable;
