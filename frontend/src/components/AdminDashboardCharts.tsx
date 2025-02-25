import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }[]
}

interface DashboardChartsProps {
  revenueData: ChartData
}

const AdminDashboardCharts = (
    { revenueData }: DashboardChartsProps
) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }


  return (
    <div className="grid md:grid-cols-2 ">
      <div className="bg-white p-6 rounded-lg shadow-md ">
        <h3 className="text-lg font-semibold mb-4">Revenue</h3>
        <Line data={revenueData} options={options} />
      </div>
      
    </div>
  )
}

export default AdminDashboardCharts;