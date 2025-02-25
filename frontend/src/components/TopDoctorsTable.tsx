
interface TopDoctorsTableProps {
  title: string
  doctors: Array<{ name: string; [key: string]: number | string }>
  valueLabel: string
}

const TopDoctorsTable = ({ title, doctors, valueLabel }: TopDoctorsTableProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h3 className="text-lg font-semibold p-4 bg-gray-50">{title}</h3>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Doctor Name</th>
            <th className="px-4 py-2 text-right">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{doctor.name}</td>
              <td className="px-4 py-2 text-right">{doctor[valueLabel.toLowerCase()]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopDoctorsTable;