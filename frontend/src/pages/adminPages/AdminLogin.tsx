import React from 'react';
import Footer from '../../components/Footer';
import AdminHeader from '../../components/AdminHeader';

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-custombg">
      {/* Header Section */}
      
      <AdminHeader/>

      {/* Login Form Section */}
      <div className="flex-grow flex items-center justify-center py-12 w-full px-4">
        <div className="bg-grey-200 rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="mb-6 text-right">
              <a href="#" className="text-teal-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <Footer/>
    </div>
  );
};

export default AdminLogin;
