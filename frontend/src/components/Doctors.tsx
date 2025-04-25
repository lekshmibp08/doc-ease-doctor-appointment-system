import React, { useEffect, useState } from 'react';
import { IPractitioner } from '../types/interfaces';
import { 
  getDoctorSpecializations, 
  getDoctors 
} from '../services/api/userApi'
import Pagination from './Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from "lucide-react"
import Swal from 'sweetalert2';


const DoctorsPage = () => {

  const [doctors, setDoctors] = useState<IPractitioner[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    latitude: 0,
    longitude: 0,
    gender: '',
    experience: '',
    fees: '',
    department: '',
  });
  const [sort, setSort] = useState('relevance');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationInput, setLocationInput] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const specialization = searchParams.get("specialization") || "";


  // Fetch Specialization for filtering
  useEffect(() => {
    const fetchSpecializations = async () => {      
      try {
        const validSpecializations = await getDoctorSpecializations();
        setSpecializations(validSpecializations);
      } catch (err) {
        console.error('Failed to load specializations', err);
      }
    };
  
    fetchSpecializations();
  }, []);


  // Fetch doctors where isApproved = true
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getDoctors({
          page: currentPage,
          size: 9,
          search,
          locationName: locationInput.includes(",") ? "" : locationInput,
          latitude: filters.latitude,
          longitude: filters.longitude,
          gender: filters.gender,
          experience: filters.experience,
          fees: filters.fees,
          department: filters.department || specialization,
          sort,
        });
        setDoctors(data.doctors);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        console.log(err);        
        setError('Failed to load doctors.');
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, [currentPage, search, locationInput, filters, sort]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      latitude: 0,
      longitude: 0,
      gender: '',
      experience: '',
      fees: '',
      department: '',
    });
    setSearch('');
    setSort('relevance');
    setCurrentPage(1);
    setLocationInput("");

    // Clear specialization query parameter
  searchParams.delete("specialization");
  setSearchParams(searchParams); // Update the URL
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    setShowLocationOptions(false)

    setFilters((prev) => ({
      ...prev,
      latitude: 0,
      longitude: 0,
    }));
  };

  const fetchCurrentLocation = async () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          setLocationInput('');

          setFilters((prev) => ({
            ...prev,
            latitude,
            longitude,
          }))
          
          setIsLoadingLocation(false);
          
        },
        (error) => {
          console.error("Error getting current location:", error)
          setError("Failed to get current location. Please enter manually.")
          Swal.fire("Error!", "Failed to get location name. Please enter manually.", "error")
          setIsLoadingLocation(false)
        }
      )
    } else {
      Swal.fire("Error!", "Geolocation is not supported by this browser.", "error")
      setError("Geolocation is not supported by this browser.")
      setIsLoadingLocation(false)
    }
  }

  return (
    <div className="bg-customBgLight min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-customTealLight text-white py-4 px-16">
        <div className="container mx-auto flex flex-wrap 
        justify-between items-center gap-4"
        >
          {/* Location Search */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter location"
              onChange={handleLocationInputChange}
              value={locationInput}
              onFocus={() => setShowLocationOptions(true)}
              onBlur={() => setTimeout(() => setShowLocationOptions(false), 200)}
              className="w-full text-customTeal md:w-48 px-4 py-2 rounded-full bg-white border border-customTeal focus:outline-none"
            />
            {showLocationOptions && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white shadow-lg rounded-lg overflow-hidden z-10">
                <button
                  onClick={fetchCurrentLocation}
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
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-2 text-customTeal"
              >
                ✖
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold">
              Sort By
            </label>
            <select onChange={handleSortChange}
              value={sort}
              className="rounded-full px-3 py-2 text-customTeal bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="experience">Experience</option>
              <option value="fees">Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="bg-customTealLight text-white shadow-md rounded-lg p-4 w-full md:w-1/5">
          <div className='flex justify-between mb-6'>
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={clearFilters}
              className="bg-customTeal text-white font-semibold rounded px-2 py-1 hover:bg-white hover:text-customTeal transition"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <select name="gender" onChange={handleFilterChange} value={filters.gender} className="rounded px-3 py-2 bg-customTeal">
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
    
            <select name="experience" onChange={handleFilterChange} value={filters.experience} className="rounded px-3 py-2 bg-customTeal">
              <option value="">Experience</option>
              <option value="1-5">1-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
    
            <select name="fees" onChange={handleFilterChange} value={filters.fees} className="rounded px-3 py-2 bg-customTeal">
              <option value="">Fees</option>
              <option value="Below ₹250">Below ₹250</option>
              <option value="250-500">₹250-₹500</option>
              <option value="Above 500">Above ₹500</option>
            </select>
              
            <select
              name="department"
              onChange={handleFilterChange}
              value={filters.department}
              className="rounded px-3 py-2 bg-customTeal"
            >
              <option value="">
                Department
              </option>
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

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <p className="text-center text-customTeal">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : doctors.length > 0 ? (
            <>
              {/* Doctors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor: Partial<IPractitioner>, index) => (
                  <div
                    key={index}
                    className="bg-customTeal shadow-md rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
                    onClick={() => navigate(`/doctor/details/${doctor._id}`)} 
                  >
                    {/* Doctor Image */}
                    <img
                      src={doctor.profilePicture || '/public/default-doctor.png'}
                      alt={doctor.fullName}
                      className="rounded-lg w-24 h-24 object-cover mb-4"
                    />
                    {/* Doctor Details */}
                    <h3 className="font-bold text-white">{doctor.fullName}</h3>
                    <p className="text-sm text-white">{doctor.specialization}</p>
                    {/* Rating */}
                    {/*
                    <div className="flex items-center justify-center mt-2 text-yellow-500">
                      {Array(Math.floor(doctor.rating))
                        .fill(null)
                        .map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      {doctor.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                    </div>
                    */}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="text-center text-customTeal">No doctors found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorsPage;
