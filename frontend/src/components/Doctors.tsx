import React from 'react';

const DoctorsPage = () => {
  const doctors = Array(6).fill({
    name: 'MBBS , MD (MEDICINE)',
    specialization: 'Consultant physician',
    image: '/public/background-1.png', // Replace with the actual image path
    rating: 4.5,
  });

  return (
    <div className="bg-customBgLight min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-customTealLight text-white py-4 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* Location Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="location" className="font-semibold">
              Location
            </label>
            <select
              id="location"
              className="rounded px-3 py-2 text-teal-700 bg-white"
            >
              <option>Location</option>
              <option>New York</option>
              <option>Los Angeles</option>
              <option>Chicago</option>
            </select>
          </div>

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
            <select
              id="sort"
              className="rounded px-3 py-2 text-teal-700 bg-white"
            >
              <option>Relevance</option>
              <option>Experience</option>
              <option>Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="bg-customTealLight text-white shadow-md rounded-lg p-4 w-full md:w-1/5"> {/* Reduced width */}
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          <div className="flex flex-col gap-4 ">
            <select className="rounded px-3 py-2 bg-customTeal">
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="rounded px-3 py-2 bg-customTeal">
              <option>Experience</option>
              <option>1-5 years</option>
              <option>6-10 years</option>
              <option>10+ years</option>
            </select>
            <select className="rounded px-3 py-2 bg-customTeal">
              <option>Availability</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
            <select className="rounded px-3 py-2 bg-customTeal">
              <option>Fees</option>
              <option>Below $50</option>
              <option>$50-$100</option>
              <option>Above $100</option>
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
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-customTeal shadow-md rounded-lg p-4 flex flex-col items-center text-center"
              >
                {/* Doctor Image */}
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="rounded-lg w-24 h-24 object-cover mb-4"
                />
                {/* Doctor Details */}
                <h3 className="font-bold text-white">{doctor.name}</h3>
                <p className="text-sm text-white">{doctor.specialization}</p>
                {/* Rating */}
                <div className="flex items-center justify-center mt-2 text-yellow-500">
                  {Array(Math.floor(doctor.rating))
                    .fill(null)
                    .map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  {doctor.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">
              Previous
            </button>
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                className="px-3 py-2 rounded bg-white shadow-md hover:bg-gray-100"
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorsPage;
