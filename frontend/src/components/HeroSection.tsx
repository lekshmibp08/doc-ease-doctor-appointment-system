import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-screen h-[300px] md:h-[400px] bg-gray-100">
      {/* Background Image */}
      <img
        src="/public/banner.png" // Replace with the correct path of your image
        alt="Hero Banner"
        className="w-full h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-16 bg-black bg-opacity-20">
        <h1 className="text-black text-2xl md:text-6xl font-bold mb-2 px-5">
          Skip the travel!
        </h1>
        <p className="text-black text-lg md:text-2xl font-semibold px-5">
          Instant appointment with doctors.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
