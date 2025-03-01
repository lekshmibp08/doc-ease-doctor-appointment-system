import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DepartmentSlider: React.FC = () => {
  const [specializations, setSpecializations] = useState<string[]>([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("/api/users/doctors/specializations");

        const validSpecializations = response.data.specializations.filter(
          (specialization: string) => specialization.trim() !== ""
        );
        setSpecializations(validSpecializations);
        
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <section className="bg-blue-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Book an appointment for an in-clinic consultation
          </h2>
          <p className="text-lg text-gray-600">
            Find experienced doctors across selected specialties
          </p>
        </div>

        {/* Slider Section */}
        <Slider {...settings}>
          {specializations.map((specialization, index) => (
            <div key={index} className="px-2">
              <Link to={`/doctors?specialization=${encodeURIComponent(specialization)}`}>
                <div className="bg-white shadow-md rounded-md overflow-hidden flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105">
                  <img
                    src={"/background-1.png"}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800">{specialization}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {/* "All Doctors" slide */}
          <div className="px-2">
            <Link to="/doctors">
              <div className="bg-white shadow-md rounded-md overflow-hidden flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105">
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <img
                    src={"/background-1.png"}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">All Doctors</h3>
                </div>
              </div>
            </Link>
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default DepartmentSlider;
