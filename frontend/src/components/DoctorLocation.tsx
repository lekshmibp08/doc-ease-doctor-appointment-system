import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const DoctorLocation = ({ addressLine, locationCoordinates }) => {
  // Default map container styles
  const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
  };

  // Default location if coordinates are missing
  const defaultCenter = {
    lat: locationCoordinates?.latitude || 0,
    lng: locationCoordinates?.longitude || 0,
  };

  // Function to format the address into multiple lines
  const formatAddress = (address: string) => {
    return address
      .split(",") // Split by commas
      .map((word, index) => <p key={index}>{word.trim()}</p>); // Return each part in a <p> tag
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Location</h3>
      <div className="bg-customBgLight1 shadow-md rounded-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center min-h-[300px]"> {/* Centering the content */}
          {/* Address - Each part on a new line */}
          <div className="flex-1 text-center text-lg"> {/* This centers the text horizontally */}
            {formatAddress(addressLine)}
          </div>

          {/* Google Map */}
          <div className="flex-1">
            {locationCoordinates ? (
              <LoadScript googleMapsApiKey="AIzaSyDvf2x8A90__qY5WQIaXhv-ayz_H5uIHF0">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={defaultCenter}
                  zoom={15} // Adjust zoom level as needed
                >
                  {/* Marker for the doctor's location */}
                  <Marker position={defaultCenter} />
                </GoogleMap>
              </LoadScript>
            ) : (
              <p>No coordinates available to display the map.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLocation;
