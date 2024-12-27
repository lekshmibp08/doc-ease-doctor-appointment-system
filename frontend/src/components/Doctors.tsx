import { useEffect, useState } from 'react';
import { IPractitioner } from '../types/interfaces';
import axios from '../services/axiosConfig';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';

const DoctorsPage = () => {

  const [doctors, setDoctors] = useState<IPractitioner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    gender: '',
    experience: '',
    availability: '',
    fees: '',
    department: '',
  });
  const [sort, setSort] = useState('relevance');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();





  // Fetch doctors where isApproved = true
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get('/api/users/doctors', {
          params: {
            page: currentPage,
            size: 8,
            search: search || "",
            location: filters.location,
            gender: filters.gender,
            experience: filters.experience,
            availability: filters.availability,
            fees: filters.fees,
            department: filters.department,
            sort: sort,
          },
        });
        setDoctors(response.data.doctors);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctors.');
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, [currentPage, search, filters, sort]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSortChange = (e: any) => {
    setSort(e.target.value);
  };

  return (
    <div className="bg-customBgLight min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-customTealLight text-white py-4 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* Location Dropdown */}
          <select name="location" onChange={handleFilterChange} value={filters.location} className="rounded px-3 py-2 bg-customTeal">
            <option value="">Location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
          </select>

          {/* Search Input */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search Doctor / Specialization"
              className="w-full rounded-full px-4 py-2 text-teal-700 bg-white"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold">
              Sort By
            </label>
            <select onChange={handleSortChange} value={sort} className="rounded px-3 py-2 text-teal-700 bg-white">
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
          <h2 className="text-lg font-bold mb-4">Filters</h2>
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
            <option value="Below $50">Below $50</option>
            <option value="$50-$100">$50-$100</option>
            <option value="Above $100">Above $100</option>
          </select>
            
            
            <select className="rounded px-3 py-2 bg-customTeal">
              <option>Department</option>
              <option>Cardiology</option>
              <option>Dentistry</option>
              <option>General Physician</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <p className="text-center text-teal-700">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : doctors.length > 0 ? (
            <>
              {/* Doctors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor: any, index) => (
                  <div
                    key={index}
                    className="bg-customTeal shadow-md rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
                    onClick={() => navigate(`/doctor/${doctor._id}`)} 

                  >
                    {/* Doctor Image */}
                    <img
                      src={doctor.profilePicture || '/public/default-doctor.png'}
                      alt={doctor.name}
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
            <p className="text-center text-teal-700">No doctors found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorsPage;
