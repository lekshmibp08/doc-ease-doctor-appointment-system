import axios from "../services/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useState } from "react";
import { setDoctorToken } from "../Redux/slices/doctorSlice";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API_URL;



const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const DoctorProfileDetails = () => {
  const { token, currentUser } = useSelector((state: RootState) => state.doctorAuth);
  const dispatch = useDispatch();

  // State for form inputs and errors
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    gender: currentUser?.gender || "",
    mobileNumber: currentUser?.mobileNumber || "",
    addressLine: currentUser?.addressLine || "",
    specialization: currentUser?.specialization || "",
    qualification: currentUser?.qualification || "",
    fee: currentUser?.fee || "",
    experience: currentUser?.experience || "",
    modesOfConsultation: currentUser?.modesOfConsultation || [],
    registerNumber: currentUser?.registerNumber || "",
    gallery: currentUser?.gallery || [],
    locationCoordinates: currentUser?.locationCoordinates || null,
    documents: currentUser?.documents || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDvf2x8A90__qY5WQIaXhv-ayz_H5uIHF0",
    libraries: ["places"],
  });

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .matches(/^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z])[A-Za-z0-9\s]+$/, 'Full Name must contain at least 3 alphabets')
      .required('Full Name is required'),
    gender: Yup.string().required("Gender is required"),
    mobileNumber: Yup.string()
      .trim()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    addressLine: Yup.string().trim().required("Address is required"),
    specialization: Yup.string().trim().required("Specialization is required"),
    qualification: Yup.string().trim().required("Qualification is required"),
    fee: Yup.number()
      .required("Fee is required")
      .positive("Fee must be a positive number"),
    experience: Yup.string().required("Experience is required"),
    modesOfConsultation: Yup.array()
      .of(Yup.string().oneOf(["Video", "Clinic"], "Invalid mode of consultation"))
      .min(1, "At least one mode of consultation is required"),
    registerNumber: Yup.string()
        .trim()
        .matches(/^DOC\d{5}$/, 'Register Number must follow the format DOC12345')
        .required('Register Number is required'),
        gallery: Yup.array()
        .of(Yup.string().url("Gallery must contain valid URLs"))
        .max(5, "You can only upload up to 5 gallery images"),
      documents: Yup.array()
        .of(Yup.string().url("Documents must contain valid URLs"))
        .max(10, "You can only upload up to 10 documents"),
      locationCoordinates: Yup.object().shape({
        latitude: Yup.number().required("Latitude is required"),
        longitude: Yup.number().required("Longitude is required"),
      }),        
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedModes = checked
      ? [...formData.modesOfConsultation, value]
      : formData.modesOfConsultation.filter((mode) => mode !== value);

    setFormData({ ...formData, modesOfConsultation: updatedModes });
  };

  // New function to handle document uploads
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Filter to ensure only allowed formats are uploaded
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles = fileArray.filter((file) => !allowedFormats.includes(file.type));
    if (invalidFiles.length > 0) {
      Swal.fire("Error!", "Only .jpg, .jpeg, or .png files are allowed.", "error");
      return;
    }

    if (formData.documents.length + fileArray.length > 10) {
      Swal.fire("Error!", "You can only upload up to 10 images.", "error");
      return;
    }

    try {
      const uploadedDocuments = await Promise.all(
        fileArray.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

          const response = await axios.post(
            CLOUDINARY_API_URL,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          return response.data.secure_url;
        })
      );

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...uploadedDocuments],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      Swal.fire("Error!", "Failed to upload images. Please try again.", "error");
    }
  };


// Gallery Upload Logic
const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const fileArray = Array.from(files);
  if (formData.gallery.length + fileArray.length > 5) {
    Swal.fire("Error!", "You can only upload up to 5 images.", "error");
    return;
  }

  try {
    const uploadedImages = await Promise.all(
      fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        const response = await axios.post(
          CLOUDINARY_API_URL,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log(response);
        
        return response.data.secure_url;
      })
    );

    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...uploadedImages],
    }));
  } catch (error) {
    console.error("Error uploading images:", error);
    Swal.fire("Error!", "Failed to upload images. Please try again.", "error");
  }
};

// Fetch Location
const handleMapClick = (event: google.maps.MapMouseEvent) => {
  if (!event.latLng) return;

  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  setFormData((prev) => ({
    ...prev,
    locationCoordinates: {
      latitude: lat,
      longitude: lng,
    },
  }));
};

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FORM DATA: ", formData);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("VALIDATED");
      
      const res = await axios.patch(
        `/api/doctors/profile/update/${currentUser?._id}`,
        formData
      );

      const updatedDoctorData = res.data.updatedDocProfile;
    
      dispatch(setDoctorToken({
        token: token ?? "",
        currentUser: updatedDoctorData,
      }));

      console.log("Form Submitted Successfully:", updatedDoctorData);
      setErrors({});
      Swal.fire("Updated!", "Details updated successfully!", "success");
    } catch (validationError: any) {
      if (validationError.inner) {
        const newErrors: Record<string, string> = {};
        validationError.inner.forEach((err: any) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Unexpected Validation Error: ", validationError);
        Swal.fire("Error!", "Validation failed. Please check your inputs.", "error");
      }
    }
  };

    // Check if the Google Maps API is loaded
    if (!isLoaded) return <div>Loading Google Maps...</div>;
    if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-2/3">
      <h3 className="text-lg font-semibold mb-4">Doctor Profile Details</h3>
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

          <div>
            <label className="block text-gray-600 mb-1">Register Number</label>
            <input
              type="text"
              id="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.registerNumber && <div className="text-red-600">{errors.registerNumber}</div>}
          </div>          

          {/* Gender */}
          <div>
            <label className="block text-gray-600 mb-1">Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <div className="text-red-600">{errors.gender}</div>}
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
              id="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.addressLine && <div className="text-red-600">{errors.addressLine}</div>}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-gray-600 mb-1">Specialization</label>
            <input
              type="text"
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.specialization && <div className="text-red-600">{errors.specialization}</div>}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-gray-600 mb-1">Qualification</label>
            <input
              type="text"
              id="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.qualification && <div className="text-red-600">{errors.qualification}</div>}
          </div>

          {/* Fee */}
          <div>
            <label className="block text-gray-600 mb-1">Fee</label>
            <input
              type="number"
              id="fee"
              value={formData.fee}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.fee && <div className="text-red-600">{errors.fee}</div>}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-600 mb-1">Experience</label>
            <input
              type="text"
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.experience && <div className="text-red-600">{errors.experience}</div>}
          </div>

          {/* Modes of Consultation */}
          <div>
            <label className="block text-gray-600 mb-1">Modes of Consultation</label>
            <div className="flex items-center gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Video"
                  checked={formData.modesOfConsultation.includes("Video")}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Video
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Clinic"
                  checked={formData.modesOfConsultation.includes("Clinic")}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Clinic
              </label>
            </div>
            {errors.modesOfConsultation && (
              <div className="text-red-600">{errors.modesOfConsultation}</div>
            )}
          </div>

          {/* Document Upload Section */}
          <div className="col-span-2">
            <label className="block text-gray-600 mb-1">Documents of Proof (Max 10)</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png" // Restrict to allowed formats
              onChange={handleDocumentUpload}
              className="block w-full mb-2"
            />
            <div className="grid grid-cols-3 gap-4">
              {formData.documents.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Document ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        documents: prev.documents.filter((_, i) => i !== index),
                      }))
                    }
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>          

          {/* Location Section */}
          <div className="col-span-2">
            <label className="block text-gray-600 mb-1">Location Coordinates</label>
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "400px",
              }}
              zoom={10}
              center={{
                lat: formData.locationCoordinates?.latitude || 37.7749, // Default latitude
                lng: formData.locationCoordinates?.longitude || -122.4194, // Default longitude
              }}
              onClick={handleMapClick}
            >
              {formData.locationCoordinates && (
                <Marker
                  position={{
                    lat: formData.locationCoordinates.latitude,
                    lng: formData.locationCoordinates.longitude,
                  }}
                />
              )}
            </GoogleMap>
            <div className="mt-4">
              <p>Latitude: {formData.locationCoordinates?.latitude}</p>
              <p>Longitude: {formData.locationCoordinates?.longitude}</p>
            </div>
          </div>

          {/* Add Gallery Section in the Form */}
          <div className="col-span-2">
            <label className="block text-gray-600 mb-1">Gallery (Max 5 Images)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="block w-full mb-2"
            />
            <div className="grid grid-cols-3 gap-4">
              {formData.gallery.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Gallery Image ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((_, i) => i !== index),
                      }))
                    }
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
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

export default DoctorProfileDetails;
