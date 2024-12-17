import { IUserProfileDetailsProps } from "../types/interfaces";

const UserProfileDetails = ({ formData, handleChange, handleUpdateDetails }: IUserProfileDetailsProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-2/3">
      <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter full name"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-600 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-gray-600 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your age"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-gray-600 mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-gray-600 mb-1">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Flat no., House no., Building"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-gray-600 mb-1">Area Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="E.g. 560001"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-600 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="E.g. Mumbai"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-gray-600 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="E.g. Kerala"
          />
        </div>
      </div>

      {/* Update Button */}
      <button
        className="mt-6 w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800"
        onClick={handleUpdateDetails}
      >
        Update Details
      </button>
    </div>
  );
};

export default UserProfileDetails;
