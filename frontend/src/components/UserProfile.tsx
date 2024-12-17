import React, { useState, useRef } from 'react';
import UserAccountDetails from './UserAccountDetails';
import UserProfileDetails from './UserProfileDetails';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    email: 'lekshmi@gmail.com',
    fullName: '',
    gender: '',
    age: '',
    mobile: '',
    pincode: '',
    addressLine1: '',
    city: '',
    state: '',
    profilePicture: '',
  });

  const [image, setImage] = useState(null);
  const fileRef = useRef(null);

  const handleSetImage = (file: File) => {
    setImage(file); // Correctly update state with File
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    console.log('Profile Updated:', formData);
  };

  const handleUpdateDetails = () => {
    console.log('Personal Details Updated:', formData);
  };

  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Box */}
        
        <UserAccountDetails/>

        {/* Right Box */}
        <UserProfileDetails
          formData={formData}
          handleChange={handleChange}
          handleUpdateDetails={handleUpdateDetails}
        />
      </div>
    </div>
  );
};

export default UserProfile;
