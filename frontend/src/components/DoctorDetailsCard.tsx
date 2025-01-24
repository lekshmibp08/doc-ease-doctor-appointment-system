import { Link, useNavigate } from "react-router-dom";
import { IPractitioner } from "../types/interfaces";

interface DoctorDetailsCardProps {
    doctor: IPractitioner; 
  }

const DoctorDetailsCard = ({ doctor }: DoctorDetailsCardProps) => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    navigate(`/book-appoinment/${doctor._id}`);
  };

  const handleChat = () => {
    navigate("/chat", { state: { doctorId: doctor._id } });
  };
  return (
    <div className="bg-customBgLight1 shadow-md rounded-lg p-6 mt-6 flex flex-col md:flex-row md:items-center gap-4">
      {/* Doctor Image (Left) */}
      <div className="flex-shrink-0">
        <img
          src={ doctor.profilePicture }
          alt="Dr. Anil Kapoor"
          className="w-40 h-40 object-cover rounded"
        />
      </div>

      {/* Doctor Info (Center) */}
      <div className="flex-1">
        {/* Name & Qualifications */}
        <h2 className="text-xl font-bold">{ doctor.fullName }</h2>
        <p className="text-gray-700 mt-1">
          {doctor.specialization} <br />
          {doctor.qualification} <br />
          {doctor.experience} Years Experience
        </p>

        {/* Verification & Fee */}
        <p className="text-green-600 font-medium mt-2">
          ✔️ Medical Registration Verified
        </p>
        <p className="mt-2 text-gray-700">Consultation Fee : {doctor.fee}</p>

        {/* Bottom Row: Rating on the left, Buttons on the right */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          {/* Star Rating + Votes */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <span className="bg-gray-200 text-yellow-600 px-2 py-1 rounded font-semibold">
              4.1/5
            </span>
            <span className="text-gray-500 text-sm">(100 votes)</span>
            <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-sm">
              Rate Now
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
             onClick={ handleBookNow }>
              Book Now
            </button>
            <button
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded
               hover:bg-gray-300 text-sm"
              onClick={handleChat}
            >
              Chat With Us
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsCard;
