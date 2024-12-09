import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DoctorLoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-white">
        <Header/>

        <main
        className="flex-1 flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/public/background-1.png')" }}
        >
            <div className="max-w-sm w-full bg-customTeal  bg-opacity-50 text-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-6 text-white">Doctor's Login</h3>
              <form className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500 text-customTeal "
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500 text-customTeal"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-red-600 text-sm hover:underline">Forgot Password?</a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded transition"
                >
                  Login
                </button>
              </form>
            </div>
        </main>
        <Footer/>

      
    </div>
  );
};

export default DoctorLoginPage;
