import { useState, useEffect, useCallback } from "react"
import DateRangeSelector from "../../components/DateRangeSelector" 
import StatCard from "../../components/StatCard"
import DocDashboardCharts from "../../components/DocDashboardCharts"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import Footer from "../../components/Footer"
import UserHeader from "../../components/UserHeader"
import DoctorSidebar from "../../components/DoctorSidebar"
import axios from "../../services/axiosConfig"
import { useSelector } from "react-redux"
import type { RootState } from "../../Redux/store"


interface DashboardStats {
  totalPatients: number
  totalAppointments: number
  totalConsultations: number
  totalRevenue: number
  appointmentData: {
    labels: string[]
    datasets: { label: string; data: number[] }[]
  }
  revenueData: {
    labels: string[]
    datasets: { label: string; data: number[] }[]
  }
}

export default function DoctorDashboard() {
  const doctorId = useSelector((state: RootState) => state.doctorAuth.currentUser?._id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const fetchDashboardStats = useCallback(async (start: Date, end: Date) => {
    setLoading(true)
    try {
      const response = await axios.post("/api/doctors/dashboard-stats", {        
        doctorId, startDate: start, endDate: end 
      })
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRangeSelect = useCallback(
    (range: string) => {
      const now = new Date()
      let start: Date, end: Date

      switch (range) {
        case "week":
          start = startOfWeek(now)
          end = endOfWeek(now)
          break
        case "month":
          start = startOfMonth(now)
          end = endOfMonth(now)
          break
        case "year":
          start = startOfYear(now)
          end = endOfYear(now)
          break
        default:
          return
      }

      setStartDate(start)
      setEndDate(end)
      fetchDashboardStats(start, end)
    },
    [fetchDashboardStats],
  )

  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardStats(startDate, endDate)
    }
  }, [startDate, endDate, fetchDashboardStats])

  useEffect(() => {
    handleRangeSelect("month") // Default to this month
  }, [handleRangeSelect])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <UserHeader role="doctor" onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <DoctorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onRangeSelect={handleRangeSelect}
            />
            {stats && (
              <>
                <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard title="Total Patients" value={stats.totalPatients} type="patients" />
                  <StatCard title="Total Appointments" value={stats.totalAppointments} type="appointments" />
                  <StatCard title="Total Consultations" value={stats.totalConsultations} type="consultations" />
                  <StatCard title="Total Revenue" value={stats.totalRevenue} type="revenue" />
                </div>
                <DocDashboardCharts appointmentData={stats.appointmentData} revenueData={stats.revenueData} />
              </>
            )}
          </div>
          
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

