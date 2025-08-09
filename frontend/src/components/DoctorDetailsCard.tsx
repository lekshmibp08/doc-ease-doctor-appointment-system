import type React from "react"
import { useNavigate } from "react-router-dom"
import type { IPractitioner } from "../types/interfaces"
import ChatButton from "./ChatButton"
import { useEffect, useState } from "react"
import { fetchDoctorReviews } from '../services/api/userApi'
import { Star, StarHalf } from "lucide-react"
import { getFullImageUrl } from "../utils/getFullImageUrl"

interface DoctorDetailsCardProps {
  doctor: IPractitioner
}

const DoctorDetailsCard: React.FC<DoctorDetailsCardProps> = ({ doctor }) => {
  const navigate = useNavigate()
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalReviews, setTotalReviews] = useState<number>(0)

  const fetchReviews = async () => {
    try {
      const reviews = await fetchDoctorReviews(doctor._id);

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum: number, review: any) => (sum += review.rating), 0)
        setAverageRating(totalRating / reviews.length)
        setTotalReviews(reviews.length)
      } else {
        setAverageRating(null)
        setTotalReviews(0)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, []) //Fixed useEffect dependency

  const handleBookNow = () => {
    navigate(`/book-appoinment/${doctor._id}`)
  }

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-500 text-yellow-500" size={18} />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-500 text-yellow-500" size={18} />)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={18} />)
    }

    return stars
  }

  return (
    <div className="bg-customBgLight1 shadow-md rounded-lg p-4 sm:p-6 mt-6 flex flex-col md:flex-row md:items-center gap-4">
      {/* Doctor Image */}
      <div className="flex-shrink-0 flex justify-center md:block">
        <img
          src={getFullImageUrl(doctor.profilePicture)}
          alt={`Dr. ${doctor.fullName}`}
          className="w-24 h-24 sm:w-40 sm:h-40 object-cover rounded"
        />
      </div>

      {/* Doctor Info */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-lg sm:text-xl font-bold">{doctor.fullName}</h2>
        <p className="text-gray-700 mt-1">
          {doctor.specialization} <br />
          {doctor.qualification} <br />
          {doctor.experience} Years Experience
        </p>

        {/* Rating & Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Enhanced Rating */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {averageRating ? (
              <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-md shadow-sm">
                <div className="flex">{renderStarRating(averageRating)}</div>
                <span className="font-medium text-gray-700 ml-1">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
                </span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm bg-white px-3 py-1.5 rounded-md shadow-sm">No reviews yet</div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
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

