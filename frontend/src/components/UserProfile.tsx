import React, { useState } from 'react';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    email: 'lekshmi@gmail.com',
    mobile: '',
    password: '',
    fullName: '',
    gender: '',
    age: '',
    pincode: '',
    addressLine1: '',
    city: '',
    state: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    console.log('Updated Profile:', formData);
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex border-b border-gray-300">
          <button className="flex-1 text-center py-2 text-teal-700 font-semibold border-b-4 border-teal-700">
            My Profile
          </button>
          <button className="flex-1 text-center py-2 text-gray-500 font-semibold hover:text-teal-700 hover:border-b-4 hover:border-teal-700">
            My Bookings
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Profile Picture Section */}
        <div className="bg-white shadow-md rounded-lg w-full lg:w-1/3 p-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <img
                src="/public/profile-placeholder.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-teal-700"
              />
              <button className="absolute bottom-0 right-0 bg-teal-700 text-white rounded-full p-1">
                + Add
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-center mb-4">Account Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email Address</p>
              <p className="text-teal-700 font-bold">{formData.email}</p>
            </div>
            <div>
              <label className="text-gray-600">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <label className="text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white shadow-md rounded-lg w-full lg:w-2/3 p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="text-gray-600">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="Male / Female"
              />
            </div>
            <div>
              <label className="text-gray-600">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="Enter your age"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Address</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600">Area Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="E.g. 560001"
              />
            </div>
            <div>
              <label className="text-gray-600">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="Flat no., House no., Building"
              />
            </div>
            <div>
              <label className="text-gray-600">Town / City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="E.g. Mumbai"
              />
            </div>
            <div>
              <label className="text-gray-600">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1"
                placeholder="E.g. Kerala"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={handleUpdate}
          className="w-full bg-teal-700 text-white font-bold py-3 rounded hover:bg-teal-800"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
