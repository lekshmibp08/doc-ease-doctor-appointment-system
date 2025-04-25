
import { useState, useEffect } from "react"
import DateRangeSelector from "../../components/DateRangeSelector"
import StatCard from "../../components/StatCard"
import AdminDashboardCharts from "../../components/AdminDashboardCharts"
import TopDoctorsTable from "../../components/TopDoctorsTable"
import { startOfMonth, endOfMonth } from "date-fns"
import AdminHeader from "../../components/AdminHeader"
import Footer from "../../components/Footer"
import Sidebar from "../../components/Sidebar"
import { getDashboardStats } from '../../services/api/adminApi'

interface AdminDashboardStats {
  totalUsers: number
  totalDoctors: number
  totalAppointments: number
  totalAmountReceived: number
  totalRevenue: number
  revenueData: {
    labels: string[]
    datasets: { label: string; data: number[] }[]
  }
  topDoctorsByAppointments: Array<{ name: string; appointments: number }>
  topRatedDoctors: Array<{ name: string; rating: number }>
}

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()))
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()))
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchDashboardStats = async (start: Date, end: Date) => {
    setLoading(true)
    try {
      const response = await getDashboardStats(start, end);
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats(startDate, endDate)
  }, [startDate, endDate])

  const handleRangeSelect = (range: string) => {
    const now = new Date()
    let start: Date, end: Date

    switch (range) {
      case "week":
        start = new Date(now.setDate(now.getDate() - 7))
        end = new Date()
        break
      case "month":
        start = startOfMonth(now)
        end = endOfMonth(now)
        break
      case "year":
        start = new Date(now.getFullYear(), 0, 1)
        end = new Date(now.getFullYear(), 11, 31)
        break
      default:
        return
    }

    setStartDate(start)
    setEndDate(end)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
          
          <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(date) => date && setStartDate(date)}
        onEndDateChange={(date) => date && setEndDate(date)}
        onRangeSelect={handleRangeSelect}
      />
      {stats && (
        <>
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
            <StatCard title="Total Users" value={stats.totalUsers} type="patients" />
            <StatCard title="Total Doctors" value={stats.totalDoctors} type="consultations" />
            <StatCard title="Total Appointments" value={stats.totalAppointments} type="appointments" />
            <StatCard title="Total Amount Received" value={stats.totalAmountReceived} type="revenue" />
            <StatCard title="Total Revenue" value={stats.totalRevenue} type="revenue" />
          </div>
          <AdminDashboardCharts revenueData={stats.revenueData} />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <TopDoctorsTable
              title="Top 10 Doctors by Appointments"
              doctors={stats.topDoctorsByAppointments}
              valueLabel="Appointments"
            />
            <TopDoctorsTable title="Top Rated Doctors" doctors={stats.topRatedDoctors} valueLabel="Rating" />
          </div>
        </>
      )}
    </div>
          
        </div>
      </div>
      <Footer />
    </>
  )
}

