import React from "react";
import { DoctorLocationProps } from "../types/interfaces";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const DoctorLocation: React.FC<DoctorLocationProps> = ({ addressLine, locationCoordinates, locationName }) => {
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
  return (
    <div className="whitespace-pre-line">
      {address.split(",").map((word, index) => (
        <p key={index} className="mb-1 text-justify">{word.trim()}</p> // Adds spacing between lines
      ))}
    </div>
  );
};


  return (
    <div className="mt-8">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">Location</h3>
      <div className="bg-customBgLight1 shadow-md rounded-md p-6">
        <div className="flex flex-col md:flex-row gap-6 min-h-[300px]"> {/* Centering the content */}
          
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-base font-bold">Address :</h4>
            <div className="flex text-center text-lg"> {/* This centers the text horizontally */}
              {formatAddress(addressLine)}
            </div>
            <h4 className="text-base font-bold">Locality :</h4>
            <div className="flex text-center text-lg"> {/* This centers the text horizontally */}
              {formatAddress(locationName)}
            </div>

          </div>

          {/* Google Map */}
          <div className="flex-1">
            {locationCoordinates ? (
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={defaultCenter}
                  zoom={15} 
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
