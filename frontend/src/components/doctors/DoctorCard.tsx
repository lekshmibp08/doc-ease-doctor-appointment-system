import type React from "react"
import type { IPractitioner } from "../../types/interfaces"
import { getFullImageUrl } from "../../utils/getFullImageUrl"

interface DoctorCardProps {
  doctor: Partial<IPractitioner>
  onClick: () => void
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  return (
    <div
      className="bg-customTeal shadow-md rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Doctor Image */}
      <img
        src={getFullImageUrl(doctor.profilePicture) || "/placeholder.svg"}
        alt={doctor.fullName || "Doctor"}
        className="rounded-lg w-24 h-24 object-cover mb-4"
      />
      {/* Doctor Details */}
      <h3 className="font-bold text-white">{doctor.fullName}</h3>
      <p className="text-sm text-white">{doctor.specialization}</p>
    </div>
  )
}

export default DoctorCard
