import type React from "react"
import { useNavigate } from "react-router-dom"
import type { IPractitioner } from "../types/interfaces"
import ChatButton from "./ChatButton"
import { useEffect, useState } from "react"
import axios from "../services/axiosConfig"

interface DoctorDetailsCardProps {
  doctor: IPractitioner
}

const DoctorDetailsCard: React.FC<DoctorDetailsCardProps> = ({ doctor }) => {
  const navigate = useNavigate()
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/users/reviews/${doctor._id}`);
      const reviews = response.data.reviews;

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum: number, review: any) => sum += review.rating, 0);
        setAverageRating((totalRating / reviews.length));
        setTotalReviews(reviews.length);
      } else {
        setAverageRating(null);
        setTotalReviews(0);
      }
      
    } catch (error) {
      console.error("Error fetching reviews:", error);      
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [doctor])

  const handleBookNow = () => {
    navigate(`/book-appoinment/${doctor._id}`)
  }

  return (
    <div className="bg-customBgLight1 shadow-md rounded-lg p-6 mt-6 flex flex-col md:flex-row md:items-center gap-4">
      {/* Doctor Image (Left) */}
      <div className="flex-shrink-0">
        <img
          src={doctor.profilePicture || "/placeholder-user.jpg"}
          alt={`Dr. ${doctor.fullName}`}
          className="w-40 h-40 object-cover rounded"
        />
      </div>

      {/* Doctor Info (Center) */}
      <div className="flex-1">
        {/* Name & Qualifications */}
        <h2 className="text-xl font-bold">{doctor.fullName}</h2>
        <p className="text-gray-700 mt-1">
          {doctor.specialization} <br />
          {doctor.qualification} <br />
          {doctor.experience} Years Experience
        </p>

        {/* Verification & Fee */}
        <p className="text-green-600 font-medium mt-2">✔️ Medical Registration Verified</p>
        <p className="mt-2 text-gray-700">Consultation Fee: {doctor.fee}</p>

        {/* Bottom Row: Rating on the left, Buttons on the right */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          {/* Star Rating + Votes */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            {averageRating && (
            <span className="bg-gray-200 text-yellow-600 px-2 py-1 rounded font-semibold">
              {averageRating}/5
            </span>
            )}
            <span className="text-gray-500 text-sm">( {totalReviews} Reviews )</span>
            {/** 
            <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-sm">
              Rate Now
            </button>
            */}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
              onClick={handleBookNow}
            >
              Book Now
            </button>
            <ChatButton doctorId={doctor._id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailsCard

