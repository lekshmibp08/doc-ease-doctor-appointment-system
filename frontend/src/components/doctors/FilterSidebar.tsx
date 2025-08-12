import type React from "react"

interface FilterSidebarProps {
  filters: {
    gender: string
    experience: string
    fees: string
    department: string
  }
  specializations: string[]
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onClearFilters: () => void
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, specializations, onFilterChange, onClearFilters }) => {
  return (
    <aside className="bg-customTealLight text-white shadow-md rounded-lg p-4 w-full md:w-1/5">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          onClick={onClearFilters}
          className="bg-customTeal text-white font-semibold rounded px-2 py-1 hover:bg-white hover:text-customTeal transition"
        >
          Clear Filters
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <select
          name="gender"
          onChange={onFilterChange}
          value={filters.gender}
          className="rounded px-3 py-2 bg-customTeal"
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          name="experience"
          onChange={onFilterChange}
          value={filters.experience}
          className="rounded px-3 py-2 bg-customTeal"
        >
          <option value="">Experience</option>
          <option value="1-5">1-5 years</option>
          <option value="6-10">6-10 years</option>
          <option value="10+">10+ years</option>
        </select>

        <select name="fees" onChange={onFilterChange} value={filters.fees} className="rounded px-3 py-2 bg-customTeal">
          <option value="">Fees</option>
          <option value="Below ₹250">Below ₹250</option>
          <option value="250-500">₹250-₹500</option>
          <option value="Above 500">Above ₹500</option>
        </select>

        <select
          name="department"
          onChange={onFilterChange}
          value={filters.department}
          className="rounded px-3 py-2 bg-customTeal"
        >
          <option value="">Department</option>
          {specializations.length > 0 ? (
            specializations.map((specialization, index) => (
              <option key={index} value={specialization}>
                {specialization}
              </option>
            ))
          ) : (
            <option disabled>No specializations available</option>
          )}
        </select>
      </div>
    </aside>
  )
}

export default FilterSidebar
