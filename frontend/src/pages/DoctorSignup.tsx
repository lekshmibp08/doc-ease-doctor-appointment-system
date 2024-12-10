import React from 'react';

const DoctorSignup = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center bg-white">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="text-customTeal font-bold text-4xl flex items-center space-x-2 mb-4">
          <span>DocEase</span>
          <i className="fas fa-stethoscope text-customTeal text-3xl"></i>
        </div>
        <p className="text-customTeal text-lg text-center">
          Connect and Manage Your Patients Here
        </p>

        <div className="mt-8">
          <img
            src="/background-2.png"
            alt="Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-blue-100 p-8 rounded-md mr-14">
        <h2 className="text-3xl font-semibold text-center text-customTeal mb-6">
          CREATE AN ACCOUNT
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customTeal"
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customTeal"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customTeal"
          />
          <input
            type="text"
            placeholder="Register Number"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customTeal"
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customTeal"
          />
          <input
            type="password"
            placeholder="Enter confirm password"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customTeal"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/doctor/login" className="text-blue-600 hover:underline">
            Back to Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignup;
