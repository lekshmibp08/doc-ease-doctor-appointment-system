import React, { useEffect, useState } from "react";
import { IPractitioner } from "../types/interfaces";
import { getDoctorSpecializations, getDoctors } from "../services/api/userApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import SearchBar from "./doctors/SearchBar"
import FilterSidebar from "./doctors/FilterSidebar"
import DoctorsGrid from "./doctors/DoctorsGrid"


const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<IPractitioner[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filters, setFilters] = useState({
    latitude: 0,
    longitude: 0,
    gender: "",
    experience: "",
    fees: "",
    department: "",
  });
  const [sort, setSort] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const specialization = searchParams.get("specialization") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (search !== debouncedSearch) {
      setCurrentPage(1)
    }
  }, [search, debouncedSearch])

  // Fetch Specialization for filtering
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const validSpecializations = await getDoctorSpecializations();
        setSpecializations(validSpecializations);
      } catch (err) {
        console.error("Failed to load specializations", err);
      }
    };

    fetchSpecializations();
  }, []);

  // Fetch approved doctors 
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDoctors({
          page: currentPage,
          size: 6,
          search: debouncedSearch,
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
        setError("Failed to load doctors.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, debouncedSearch, locationInput, filters, sort]);

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
      gender: "",
      experience: "",
      fees: "",
      department: "",
    });
    setSearch("");
    setDebouncedSearch("")
    setSort("relevance");
    setCurrentPage(1);
    setLocationInput("");

    // Clear specialization query parameter
    searchParams.delete("specialization");
    setSearchParams(searchParams); // Update the URL
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLocationInput(value);
    setShowLocationOptions(false);

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

          setLocationInput("");

          setFilters((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));

          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setError("Failed to get current location. Please enter manually.");
          Swal.fire(
            "Error!",
            "Failed to get location name. Please enter manually.",
            "error"
          );
          setIsLoadingLocation(false);
        }
      );
    } else {
      Swal.fire(
        "Error!",
        "Geolocation is not supported by this browser.",
        "error"
      );
      setError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
    }
  };

  const handleDoctorClick = (doctorId: string) => {
    navigate(`/doctor/details/${doctorId}`)
  }

  return (
    <div className="bg-customBgLight min-h-screen">
      <SearchBar
        search={search}
        setSearch={setSearch}
        locationInput={locationInput}
        setLocationInput={setLocationInput}
        sort={sort}
        setSort={setSort}
        showLocationOptions={showLocationOptions}
        setShowLocationOptions={setShowLocationOptions}
        isLoadingLocation={isLoadingLocation}
        onFetchCurrentLocation={fetchCurrentLocation}
        onLocationInputChange={handleLocationInputChange}
        onSortChange={handleSortChange}
      />

      {/* Sidebar and Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <FilterSidebar
          filters={filters}
          specializations={specializations}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <main className="flex-1">
          <DoctorsGrid
            doctors={doctors}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onDoctorClick={handleDoctorClick}
          />
        </main>
      </div>
    </div>
  )
}

export default DoctorsPage;
