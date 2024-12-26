import axios from "../services/axiosConfig";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { setUserToken } from "../Redux/slices/userSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

// Form validation schema with Yup
const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current Password is required"),  
  password: Yup.string()
    .matches(/[A-Za-z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .min(6, "Password must be at least 6 characters long")
    .notRequired(),  // password is optional for updates

  confirmPassword: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .oneOf([Yup.ref('password')], 'Passwords must match')  // confirm password must match the password
    .notRequired(), // confirmPassword is optional for updates
});

const UserAccountDetails = () => {
  const { token, currentUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageError, setImageError] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);

  const handleFileUpload = async (image: File) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "DocEase");
    data.append("cloud_name", "dgpy8wkiw");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgpy8wkiw/image/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setImagePercent(percent);
            }
          },
        }
      );

      // Getting the URL of the uploaded image from Cloudinary
      const { secure_url } = response.data;

      // Return the URL to be used for Formik
      return secure_url;
    } catch (error) {
      setImageError(true);
      Swal.fire("Error!", "Error uploading image", "error");      
      console.error("Error uploading image:", error);
      return null; // If the upload fails, return null
    }
  };

  const handlesubmit = async (values: any, { resetForm, setFieldValue }: any) => {    
    const { currentPassword, password, profilePicture } = values;
  
    const updatedData: any = {
      currentPassword
    };
  
    if (password) {
      updatedData.password = password;
    }
  
    if (profilePicture) {
      updatedData.profilePicture = profilePicture;
    }
  
    try {
      const res = await axios.patch(
        `/api/users/profile/update/${currentUser?._id}`,
        updatedData
      );
      
      const updatedUserData = res.data.updatedUser;
      console.log("Profile updated:", updatedUserData);
  
      dispatch(setUserToken({
        token: token ?? "", 
        currentUser: updatedUserData
      }));  

      setImagePercent(0);
      setFieldValue("profilePicture", updatedUserData.profilePicture);
      resetForm({ 
        values: { 
          profilePicture: updatedUserData.profilePicture, 
          currentPassword: "",
          password: "", 
          confirmPassword: "" } });      
      Swal.fire("Updated!", "Profile updated successfully!", "success");      
  
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error!", "Failed to update profile. Please try again.", "error");      

    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/3">
      <Formik
        initialValues={{
          currentPassword: "",
          password: "",
          confirmPassword: "",
          profilePicture: currentUser?.profilePicture || "",  
        }}
        validationSchema={validationSchema}
        onSubmit={handlesubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={async (e: any) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);

                    // Call handleFileUpload and get the URL after the upload
                    const uploadedImageUrl = await handleFileUpload(file);
                    if (uploadedImageUrl) {
                      setFieldValue("profilePicture", uploadedImageUrl);
                    }
                  }
                }}
              />

              {/* Profile Image */}
              <img
                src={values.profilePicture || currentUser?.profilePicture}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover cursor-pointer"
                onClick={() => fileRef.current!.click()}
              />

              {/* Upload Progress */}
              <div className="mt-2 text-center w-full">
                {imageError ? (
                  <span className="text-red-700">
                    Error Uploading Image (file size must be less than 2 MB)
                  </span>
                ) : imagePercent > 0 && imagePercent < 100 ? (
                  <span className="text-slate-700">{`Uploading: ${imagePercent}%`}</span>
                ) : imagePercent === 100 ? (
                  <span className="text-green-700">Image Uploaded Successfully</span>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* Account Details */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Account Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Email Address</p>
                <p className="font-semibold">{currentUser?.email}</p>
              </div>

              {/* Current Password Section */}
              <div>
                <p className="text-gray-600">Change Password</p>
                <Field
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                <ErrorMessage name="currentPassword" component="div" className="text-red-600" />
              </div>              

              {/* Password Section */}
              <div>
                <div className="space-y-2 mt-2">
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="New Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600" />

                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600" />
                </div>
              </div>
            </div>

            {/* Update Button */}
            <button type="submit" className="mt-6 w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800">
              Update Profile
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserAccountDetails;
