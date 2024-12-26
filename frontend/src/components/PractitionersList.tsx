import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import Swal from "sweetalert2";
import Pagination from './Pagination';
import { IPractitioner } from '../types/interfaces';


const PractitionersList = () => {
  const [practitioners, setPractitioners] = useState<IPractitioner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/admin/doctors', {
          params: {
            page: currentPage,
            size: 8,
            search: search || "",
          },
        });

        setPractitioners(response.data.doctors);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [currentPage, search]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); 
  };

  const handleBlock = async (id: string, isBlocked: boolean) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock it!" : "Yes, Block it!",
    });

    if (result.isConfirmed){
      try {
        const response = await axios.patch(`/api/admin/doctors/block/${id}`);
        const { isBlocked } = response.data;
  
        setPractitioners((prev) =>
          prev.map((doctor) =>
            doctor._id === id ? { ...doctor, isBlocked } : doctor
          )
        );   
        if (isBlocked) {
          Swal.fire("Approved!", response.data.message, "success");
        } else {
          Swal.fire("Rejected!", response.data.message, "success");
        }
      } catch (error) {
        console.error("Error processing request:", error);
        Swal.fire("Error!", "An error occurred. Please try again.", "error");
      }        

    }
  }


const handleApproval = async (id: string, isApproved: boolean) => {
  if (isApproved) {
    // Open a SweetAlert2 modal with a text input for the rejection reason
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

    console.log(reason);
    

    if (!reason) return; 

    try {
      
      const response = await axios.patch(`/api/admin/doctors/approve/${id}`, {reason});

      
      setPractitioners((prev) =>
        prev.map((doctor) =>
          doctor._id === id ? { ...doctor, isApproved: false } : doctor
        )
      );

      Swal.fire("Rejected!", "The doctor has been rejected successfully.", "success");
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      Swal.fire("Error!", "An error occurred. Please try again.", "error");
    }
  } else {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve it!",
    });

    if (result.isConfirmed){
      try {
        const response = await axios.patch(`/api/admin/doctors/approve/${id}`, {
        });
  
        setPractitioners((prev) =>
          prev.map((doctor) =>
            doctor._id === id ? { ...doctor, isApproved: true } : doctor
          )
        );
  
        Swal.fire("Approved!", "The doctor has been approved successfully.", "success");
      } catch (error) {
        console.error("Error approving doctor:", error);
        Swal.fire("Error!", "An error occurred. Please try again.", "error");
      }
    }
  }
    
};


  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Practitioners</h2>
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
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Phone</th>
              <th className="p-3 text-center border">Approve Updates</th>
              <th className="p-3 text-center border">Block / Unblock</th>
            </tr>
          </thead>
          <tbody>
            {practitioners.map((practitioner) => (
              <tr key={practitioner._id} className="hover:bg-gray-100">
                <td className="p-3 border">{practitioner.registerNumber}</td>
                <td className="p-3 border">{practitioner.fullName}</td>
                <td className="p-3 border">{practitioner.email}</td>
                <td className="p-3 border font-semibold">{practitioner.mobileNumber}</td>
                <td className="p-3 text-center border">
                  <button onClick={() => handleApproval(practitioner._id, practitioner.isApproved)}
                    className={`${
                      practitioner.isApproved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                    } text-white px-4 py-1 rounded transition`}
                  >
                    {practitioner.isApproved ? 'Reject' : 'Approve'}
                  </button>
                </td>
                <td className="p-3 text-center border">
                  <button onClick={() => handleBlock(practitioner._id, practitioner.isBlocked)}
                    className={`${
                      practitioner.isBlocked ? 'bg-yellow-600 hover:bg-yellow-800' : 'bg-red-600 hover:bg-red-800'
                    } text-white px-4 py-1 rounded transition`}
                  >
                    {practitioner.isBlocked ? 'Unblock' : 'Block'}
                  </button>
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

export default PractitionersList;
