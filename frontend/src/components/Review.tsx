import React, { useEffect, useState } from "react";
import { IReview } from "@/types/interfaces";
import axios from "../services/axiosConfig";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ReviewProps {
  doctorId: string;
}

const Review: React.FC<ReviewProps> = ({ doctorId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/users/reviews/${doctorId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.log("Error in fetching reviews: ", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

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
      <h3 className="text-xl font-bold mb-4 text-center">Reviews</h3>
      <div className=" bg-customBgLight1 shadow-lg rounded-lg p-6 mx-auto">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews available.</p>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 text-gray-700 hover:bg-gray-400 p-3 rounded-full shadow-md z-10 transition duration-200"
            >
              <FaChevronLeft size={20} />
            </button>

            {/* Review Slider */}
            <div className="overflow-hidden w-full max-w-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md p-4 rounded-lg w-full max-w-[31rem] mx-2 flex-shrink-0 text-center border border-gray-200"
                  >
                    <p className="font-bold text-lg">{review.userId.fullName}</p>
                    <p className="text-yellow-500 font-semibold mt-1">{review.rating} / 5 ★</p>
                    <p className="text-sm text-gray-600 mt-2 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 text-gray-700 hover:bg-gray-400 p-3 rounded-full shadow-md z-10 transition duration-200"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {reviews.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                } transition-all duration-300`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
