import React, { useState } from "react";

const Review = ({ doctorId }) => {
  const reviews = [
    {
      user: "User 1",
      review:
        "A friendly doctor ready to explain the treatment process and associated costs.",
    },
    {
      user: "User 2",
      review:
        "The doctor is highly professional and explains the treatment process thoroughly.",
    },
    {
      user: "User 3",
      review:
        "Very caring and knowledgeable, providing excellent care and advice.",
    },
    {
      user: "User 4",
      review:
        "The doctor is approachable and provides detailed explanations about the treatment.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="mt-8">
      {/* Heading outside the card */}
      <h3 className="text-xl font-bold mb-4">Review</h3>

      {/* Card container */}
      <div className="bg-white shadow-md rounded-md p-6">
        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 bg-gray-200 text-gray-600 rounded-full p-2 hover:bg-gray-300 z-10"
          >
            ◀
          </button>

          {/* Review Slider */}
          <div className="overflow-hidden w-full max-w-4xl">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-4 rounded-md w-full max-w-md mx-2 flex-shrink-0"
                >
                  <p className="font-bold">{item.user}</p>
                  <p className="text-sm text-gray-600 mt-2">{item.review}</p>
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
      </div>
    </div>
  );
};

export default Review;
