import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import Swal from 'sweetalert2';

interface ForgetPasswordModalProps {
  onClose: () => void;
  title?: string;
  onSendOTP: (email: string) => Promise<string>;
  onResetPassword: (data: { email: string; newPassword: string; otp: string }) => Promise<string>;
  timerDuration?: number;
}

const ForgetPasswordModal: React.FC<ForgetPasswordModalProps> = ({
  onClose,
  title = "Reset Password",
  onSendOTP,
  onResetPassword,
  timerDuration = 120,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(timerDuration);
  const [message, setMessage] = useState('');

  const validationSchemas = {
    step1: yup.object().shape({
      email: yup.string().email('Invalid email format').required('Email is required'),
      newPassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\W_]/, 'Password must contain at least one special character')
        .required('New password is required'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    step2: yup.object().shape({
      otp: yup
        .string()
        .matches(/^\d{6}$/, 'OTP must be a 6-digit number')
        .required('OTP is required'),
    }),
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    try {
      const currentSchema = step === 1 ? validationSchemas.step1 : validationSchemas.step2;
      await currentSchema.validateAt(id, { ...formData, [id]: value });
      setErrors({ ...errors, [id]: '' });
    } catch (err: any) {
      setErrors({ ...errors, [id]: err.message });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await validationSchemas.step1.validateAt('email', { email: formData.email });

      const responseMessage = await onSendOTP(formData.email);
      setMessage(responseMessage || 'OTP sent to your email.');
      setStep(2);
      setTimer(timerDuration);
      Swal.fire("Success!", 'OTP sent to your email!', "success");      
      
    } catch (error: any) {
      setMessage(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleSubmitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await validationSchemas.step2.validate(formData, { abortEarly: false });

      const responseMessage = await onResetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
        otp: formData.otp,
      });
      setMessage(responseMessage || 'Password reset successful!');
      Swal.fire("Success!", responseMessage, "success");  
      onClose();    

    } catch (error: any) {
      setMessage(error.message || 'Failed to reset password.');
    }
  };

  const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded shadow-lg w-96">
        <h3 className="text-xl text-center font-bold mb-4">{title}</h3>

        {message && <div className="text-red-600 text-center mb-4">{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded w-full">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitResetPassword}>
            <div className="mb-4">
              <label className="block font-semibold mb-2" htmlFor="otp">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={formData.otp}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${
                  errors.otp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter OTP"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              <p className="text-sm text-gray-600 mt-2">OTP expires in {formatTimer(timer)}</p>
            </div>

            <button
              type="submit"
              className={`px-4 py-2 rounded w-full ${
                timer === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
              disabled={timer === 0}
            >
              Reset Password
            </button>
          </form>
        )}

        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
