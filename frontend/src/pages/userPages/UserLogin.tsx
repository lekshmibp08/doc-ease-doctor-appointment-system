import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import OAuth from '../../components/OAuth';
import ForgetPasswordModal from '../../components/ForgetPasswordModal';
import { setUserToken, clearUserToken } from '../../Redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import {
  loginUser,
  sendForgotPasswordOtp,
  verifyOtpAndResetPassword,
} from '../../services/api/userApi'

const UserLogin = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { token } = useSelector((state: RootState) => state.userAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Redux Token:", token);
    if (token) {
      navigate('/doctors', { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');

    try {
      dispatch(clearUserToken());
      const response = await loginUser(formData);

      const { token, userData } = response.data;

      dispatch(setUserToken({ token, currentUser: userData }));

      navigate('/doctors', { replace: true });
    } catch (error: any) {
      setError(error.response.data.message || 'Network Error');
    }
  };

  const handleSendOTP = async (email: string): Promise<string> => {
    try {
      const response = await sendForgotPasswordOtp(email);
      return response.data.message || 'OTP sent successfully.';
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    }
  };

  const handleResetPassword = async (data: {
    email: string;
    newPassword: string;
    otp: string;
  }): Promise<string> => {
    try {
      const response = await verifyOtpAndResetPassword(data);
      return response.data.message || 'Password reset successful!';
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to reset password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-white">
      <Header />
      <main
        className="flex-1 flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background-1.png')" }}
      >
        <div className="max-w-sm w-full bg-customTeal bg-opacity-50 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">Login</h3>

          {error && <div className="text-red-600 text-lg mb-4 text-center">{error}</div>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500 text-customTeal"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500 text-customTeal"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-red-600 text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded transition"
            >
              Login
            </button>

            <div className="flex items-center justify-center mb-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-sm text-gray-500 px-4">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <OAuth />
          </form>
        </div>
      </main>

      {showModal && (
        <ForgetPasswordModal
          onClose={() => setShowModal(false)}
          title="User Password Reset"
          onSendOTP={handleSendOTP}
          onResetPassword={handleResetPassword}
        />
      )}

      <Footer />
    </div>
  );
};

export default UserLogin;
