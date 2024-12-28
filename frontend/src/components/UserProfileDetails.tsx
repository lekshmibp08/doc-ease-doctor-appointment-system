import axios from "../services/axiosConfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import * as Yup from "yup";
import { useState } from "react";
import { setUserToken } from "../Redux/slices/userSlice";

const UserProfileDetails = () => {
  const { token, currentUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  // State for form inputs and errors
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    gender: currentUser?.gender || "",
    age: currentUser?.age || "",
    mobileNumber: currentUser?.mobileNumber || "",
    addressline: currentUser?.addressline || "",
    pincode: currentUser?.pincode || "",
    city: currentUser?.city || "",
    state: currentUser?.state || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Full name must contain only alphabets and spaces")
      .min(3, "Full name must contain at least 3 alphabets")
      .required("Full name is required"),
    gender: Yup.string().required("Gender is required"),
    age: Yup.number()
      .required("Age is required")
      .positive("Age must be a positive number")
      .integer("Age must be a valid number"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    addressline: Yup.string().required("Address is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
  });

  // Handle input changes with real-time validation
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    // Update input value
    setFormData({
      ...formData,
      [id]: value,
    });

    try {
      // Validate the specific field using validateAt
      await validationSchema.validateAt(id, { [id]: value });
      // Clear the error if validation passes
      setErrors({ ...errors, [id]: "" });
    } catch (err: any) {
      // Update the error message for the field
      setErrors({ ...errors, [id]: err.message });
    }
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FORM DATA: ", formData);
    

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const res = await axios.patch(
        `/api/users/profile/update/${currentUser?._id}`,
        formData
      );

      const updatedUserData = res.data.updatedUser;

      dispatch(setUserToken({
        token: token ?? "", 
        currentUser: updatedUserData
      }));  

      console.log("Form Submitted Successfully:", res.data.updatedUser);
      setErrors({});
      Swal.fire("Updated!", res.data.message, "success");
    } catch (validationError: any) {
      const newErrors: Record<string, string> = {};
      validationError.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-customBgLight1 shadow-md rounded-lg p-6 w-full lg:w-2/3">
      <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
      <form onSubmit={handleUpdateDetails}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.fullName && <div className="text-red-600">{errors.fullName}</div>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-600 mb-1">Gender</label>
            <select
              id="gender"
              defaultValue={currentUser?.gender || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <div className="text-red-600">{errors.gender}</div>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-600 mb-1">Age</label>
            <input
              type="text"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.age && <div className="text-red-600">{errors.age}</div>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-600 mb-1">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.mobileNumber && <div className="text-red-600">{errors.mobileNumber}</div>}
          </div>

          {/* Address Line */}
          <div>
            <label className="block text-gray-600 mb-1">Address Line</label>
            <input
              type="text"
              id="addressline"
              value={formData.addressline}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.addressline && <div className="text-red-600">{errors.addressline}</div>}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-600 mb-1">Area Pincode</label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.pincode && <div className="text-red-600">{errors.pincode}</div>}
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-600 mb-1">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.city && <div className="text-red-600">{errors.city}</div>}
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-600 mb-1">State</label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.state && <div className="text-red-600">{errors.state}</div>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800"
        >
          Update Details
        </button>
      </form>
    </div>
  );
};

export default UserProfileDetails;
