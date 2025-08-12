import type React from "react"
import type { IPractitioner } from "../../types/interfaces"
import DoctorCard from "./DoctorCard"
import Pagination from "../Pagination"

interface DoctorsGridProps {
  doctors: IPractitioner[]
  loading: boolean
  error: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onDoctorClick: (doctorId: string) => void
}

const DoctorsGrid: React.FC<DoctorsGridProps> = ({
  doctors,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onDoctorClick,
}) => {
  if (loading) {
    return <p className="text-center text-customTeal">Loading...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  if (doctors.length === 0) {
    return <p className="text-center text-customTeal">No doctors found.</p>
  }

  return (
    <>
      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor: Partial<IPractitioner>, index) => (
          <DoctorCard key={index} doctor={doctor} onClick={() => onDoctorClick(doctor._id!)} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  )
}

export default DoctorsGrid
