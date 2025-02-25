import { Users, Calendar, Stethoscope, DollarSign } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  type: "patients" | "appointments" | "consultations" | "revenue"
  change?: number
}

const icons = {
  patients: Users,
  appointments: Calendar,
  consultations: Stethoscope,
  revenue: DollarSign,
}

const StatCard = ({ title, value, type, change }: StatCardProps) => {
  const Icon = icons[type]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-5 w-5 text-teal-500" />
      </div>
      <div className="text-2xl font-bold">{type === "revenue" ? `₹${value.toLocaleString()}` : value}</div>
      {change !== undefined && (
        <p className={`text-xs ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
        </p>
      )}
    </div>
  )
}

export default StatCard;