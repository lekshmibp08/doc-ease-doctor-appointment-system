import React, { useState } from "react";

interface DoctorGalleryProps {
  images: string[];
}

const DoctorGallery = ({ images = [] }: DoctorGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  //if (!images.length) return <div>No images in gallery.</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Gallery</h3>
      <div className="bg-customBgLight1 shadow-md rounded-lg p-6">

        {images.length ? (

        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 bg-gray-200 text-gray-600 rounded-full p-2 hover:bg-gray-300 z-10"
          >
            ◀
          </button>

          {/* Image Slider */}
          <div className="overflow-hidden w-full max-w-4xl">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((imgUrl, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <img
                    src={imgUrl}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full max-h-64 object-contain rounded-md" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 bg-gray-200 text-gray-600 rounded-full p-2 hover:bg-gray-300 z-10"
          >
            ▶
          </button>
        </div>
          
        ) : (          
          <div>No images in gallery.</div>
        )}
        
      </div>
    </div>
  );
};

export default DoctorGallery;
