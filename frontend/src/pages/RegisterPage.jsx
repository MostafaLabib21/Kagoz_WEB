import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
  if (score <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%' };
};

const RegisterPage = () => {
  const { register, verifyEmail, resendVerification, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(formData.password)) errs.password = 'Must include an uppercase letter';
    else if (!/[a-z]/.test(formData.password)) errs.password = 'Must include a lowercase letter';
    else if (!/[0-9]/.test(formData.password)) errs.password = 'Must include a number';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      errs.password = 'Must include a special character';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      await register(formData.name, formData.email, formData.password);
      setStep('verify');
      setResendCooldown(60);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setApiError('');
    try {
      await verifyEmail(formData.email, otp);
      navigate('/shop');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendVerification(formData.email);
      setResendCooldown(60);
    } catch {
      // ignore — server always returns same response
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setApiError('');
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/shop');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Google sign-up failed');
    }
  };

  const strength = getPasswordStrength(formData.password);

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Verify your email</h2>
          <p className="text-center text-gray-500 mb-8">
            We sent a 6-digit code to <span className="font-medium text-gray-700">{formData.email}</span>
          </p>

          {apiError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {apiError}
            </div>
          )}

          <OTPInput length={6} onComplete={(code) => setOtp(code)} />

          <button
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center mt-4">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-sm text-indigo-600 hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create an account</h2>

        {apiError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {apiError}
          </div>
        )}

        {/* Google Sign Up */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setApiError('Google sign-up failed')}
            text="signup_with"
            shape="rectangular"
            width="100%"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-12"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
