import { Users, Calendar, Stethoscope, DollarSign } from "lucide-react"
import { StatCardProps } from "../types/interfaces"

const DocStatCard = ({ title, value, type }: StatCardProps) => {
  const icons = {
    patients: Users,
    appointments: Calendar,
    consultations: Stethoscope,
    revenue: DollarSign,
  }

  const Icon = icons[type]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-teal-100 rounded-lg">
          <Icon className="w-6 h-6 text-teal-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{type === "revenue" ? `₹${value}` : value}</h3>
        </div>
      </div>
    </div>
  )
}

export default DocStatCard;

