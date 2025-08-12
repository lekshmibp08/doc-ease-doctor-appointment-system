import type React from "react"
import { Loader2 } from "lucide-react"

interface SearchBarProps {
  search: string
  setSearch: (value: string) => void
  locationInput: string
  setLocationInput: (value: string) => void
  sort: string
  setSort: (value: string) => void
  showLocationOptions: boolean
  setShowLocationOptions: (show: boolean) => void
  isLoadingLocation: boolean
  onFetchCurrentLocation: () => void
  onLocationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  locationInput,
  sort,
  showLocationOptions,
  setShowLocationOptions,
  isLoadingLocation,
  onFetchCurrentLocation,
  onLocationInputChange,
  onSortChange,
}) => {
  return (
    <div className="bg-customTealLight text-white py-4 px-16">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        {/* Location Search */}
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Enter location"
            onChange={onLocationInputChange}
            value={locationInput}
            onFocus={() => setShowLocationOptions(true)}
            onBlur={() => setTimeout(() => setShowLocationOptions(false), 200)}
            className="w-full text-customTeal md:w-48 px-4 py-2 rounded-full bg-white border border-customTeal focus:outline-none"
          />
          {showLocationOptions && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white shadow-lg rounded-lg overflow-hidden z-10">
              <button
                onClick={onFetchCurrentLocation}
                disabled={isLoadingLocation}
                className="block w-full text-left px-4 py-2 text-customTeal hover:bg-gray-100"
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Detecting location...
                  </>
                ) : (
                  "Use My Location"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-grow relative z-0">
          <input
            type="text"
            placeholder="Search Doctor / Specialization"
            className="w-full rounded-full px-4 py-2 text-customTeal bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-2 text-customTeal">
              ✖
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="font-semibold">
            Sort By
          </label>
          <select onChange={onSortChange} value={sort} className="rounded-full px-3 py-2 text-customTeal bg-white">
            <option value="relevance">Relevance</option>
            <option value="experience">Experience</option>
            <option value="fees">Fees</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
