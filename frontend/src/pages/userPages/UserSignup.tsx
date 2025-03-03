import { useState, useEffect } from 'react';
import axios from '../../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store'; 
import OAuth from '../../components/OAuth';

// Validation schema for the first step (Registration)
const step1ValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z])[A-Za-z\s]+$/, 'Full Name must contain at least 3 alphabets')
    .required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be 10 digits')
    .required('Mobile Number is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must be at least 6 characters long and include a letter, a number, and a special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords do not match.')
    .required('Confirm Password is required'),
});

const UserSignup = () => {

  const token = useSelector((state: RootState) => state.userAuth.token )

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(120); // Timer in seconds
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]); // Runs whenever the token or navigate changes

  useEffect(() => {
    let interval: any;
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

  // Format the timer as MM:SS
  const formatTimer = (time: any) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Step 1: Register and Request OTP
  const handleRegister = async (values: any) => {
    setError('');
    try {
      const response = await axios.post('/api/users/send-otp', { email: values.email });
      setMessage(response.data.message);
      setStep(2); // Move to Step 2
      setTimer(120); // Reset timer for 2 minutes
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (values: any) => {
    setError('');
    setMessage('');
    try {
      const response = await axios.post('/api/users/verify-otp-and-register', values);
      setMessage(response.data.message);
      navigate('/user/login'); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center bg-white">

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="text-customTeal text-4xl flex items-center space-x-2 mb-4">
          <span style={{ fontFamily: "'Lobster', cursive" }}>DocEase</span>
          <i className="fas fa-stethoscope text-customTeal text-3xl"></i>
        </div>
        <p className="text-customTeal text-lg text-center">Search for a <span className="font-semibold">DOCTOR</span> who suits your needs</p>
        <div className="mt-8">
          <img src="/background-2.png" alt="Illustration" className="max-w-full h-auto" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-blue-100 p-8 rounded-md mr-14">
        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          {step === 1 ? 'Register' : 'Verify OTP'}
        </h2>

        {message && <div className="text-green-600 text-center mb-4">{message}</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {step === 1 ? (
          <Formik
            initialValues={{
              fullName: '',
              email: '',
              mobileNumber: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={step1ValidationSchema}
            onSubmit={(values) => handleRegister(values)}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                  <ErrorMessage name="fullName" component="div" className="text-red-600 text-sm" />
                </div>
                
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                </div>
                
                <div>
                  <Field
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                  <ErrorMessage name="mobileNumber" component="div" className="text-red-600 text-sm" />
                </div>            
                
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                </div>
                
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </button>

                <div className="flex items-center justify-center mb-4">
                  <hr className="flex-grow border-gray-300" />
                  <span className="text-sm text-gray-500 px-4">Or</span>
                  <hr className="flex-grow border-gray-300" />
                </div>
                <OAuth/>

              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ otp: '' }}
            onSubmit={(values) => handleVerifyOtp(values)}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                </div>
                <button
                  type="submit"                  
                  className={`w-full py-2 rounded  bg-blue-600 text-white transition ${timer > 0 ? 
                    ' hover:bg-blue-700' : 
                    'opacity-50 cursor-not-allowed' }`} 
                  
                    disabled={timer === 0}
                >
                  Verify OTP
                </button>
              </Form>
            )}
          </Formik>
        )}

        <p className="text-center text-gray-600 mt-4">
          {step === 1 ? (
            <>
              Already have an account?{' '}
              <a href="/user/login" className="text-blue-600 hover:underline">
                Back to Log In
              </a>
            </>
          ) : (
            <>
              <div className="text-center text-gray-600 mb-2">Time Remaining: {formatTimer(timer)}</div>
              <button
                onClick={() => {
                  if (timer === 0) {
                    setStep(1);
                    setError('');
                    setMessage('');
                  }
                }}
                className={`text-blue-600 focus:outline-none ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                disabled={timer > 0} 
              >
                Back to Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
