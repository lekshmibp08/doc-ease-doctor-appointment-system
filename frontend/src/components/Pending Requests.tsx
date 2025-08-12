import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import Pagination from './Pagination';
import { IPractitioner } from '../types/interfaces';
import { useNavigate } from 'react-router-dom';
import { 
  getPendingRequests,
  approveDoctorById,
  rejectDoctorById 
} from '../services/api/adminApi'
import { getFullImageUrl } from '../utils/getFullImageUrl';


const PendingRequests = () => {
  const [pendingDoctors, setPendingDoctors] = useState<IPractitioner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch pending doctors
  const fetchPendingDoctors  = async () => {
    try {
      const response = await getPendingRequests(currentPage, search)

      setPendingDoctors(response.data.doctors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, [currentPage, search]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); 
  };

  // Approve doctor
  const approveDoctor = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve it!",
    });   
    if (result.isConfirmed){
      try {
        await approveDoctorById(id);
        Swal.fire("Success", "Doctor approved successfully", "success");
        fetchPendingDoctors();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to approve doctor", "error");
      }
    } 
  };

  // Reject doctor
  const rejectDoctor = async (id: string) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Practitioner",
      input: "textarea",
      inputPlaceholder: "Enter the reason for rejection...",
      inputAttributes: { "aria-label": "Rejection reason" },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      preConfirm: (input) => {
        if (!input || input.trim() === "") {
          Swal.showValidationMessage("Rejection reason is required");
        }
        return input;
      },
    });            

    if (!reason) return; 
    try {
      await rejectDoctorById(id, reason);
      Swal.fire("Success", "Doctor rejected successfully", "success");
      fetchPendingDoctors(); 
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to reject doctor", "error");
    }
  };


  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">New Requests</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left border">Reg. No</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">View Documents</th>
              <th className="p-3 text-center border">Approve</th>
              <th className="p-3 text-center border">Reject</th>
            </tr>
          </thead>
          <tbody>
            {pendingDoctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-100">
                <td className="p-3 border">{doctor.registerNumber}</td>
                <td className="p-3 border">{doctor.fullName}</td>
                <td className="p-3 border text-center">
                {doctor.documents && doctor.documents.length > 0 ? (
                  <button
                    onClick={() =>
                      navigate(`/admin/doctors/view-documents/${doctor._id}`, {
                        state: {
                          documents: doctor.documents.map((doc) => getFullImageUrl(doc)),
                        },
                      })
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                ) : (
                  <span className="text-gray-500">No Documents</span>
                )}
                </td>
                <td className="p-3 border text-center">
                  {!doctor.isRejected ? (
                    <button
                      onClick={() => approveDoctor(doctor._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3 border text-center">
                  {doctor.isRejected ? (
                    <span className="text-red-500 font-semibold">Rejected</span>
                  ) : (
                    <button
                      onClick={() => rejectDoctor(doctor._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  )}
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

export default PendingRequests;
