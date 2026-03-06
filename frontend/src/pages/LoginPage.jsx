import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';

const LoginPage = () => {
  const { login, googleLogin, verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Unverified email flow
  const [showVerify, setShowVerify] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      const data = err.response?.data;
      if (data?.unverified) {
        setUnverifiedEmail(email);
        setApiError('Your email is not verified yet.');
      } else {
        setApiError(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendVerification(unverifiedEmail);
      setShowVerify(true);
      setResendCooldown(60);
      setApiError('');
    } catch {
      // ignore
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setApiError('');
    try {
      await verifyEmail(unverifiedEmail, otp);
      navigate(redirect);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setApiError('');
    try {
      await googleLogin(credentialResponse.credential);
      navigate(redirect);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  // OTP verification inline view
  if (showVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Verify your email</h2>
          <p className="text-center text-gray-500 mb-8">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-gray-700">{unverifiedEmail}</span>
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
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Welcome back</h2>

        {apiError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {apiError}
            {unverifiedEmail && !showVerify && (
              <button
                onClick={handleResend}
                className="block mx-auto mt-2 text-indigo-600 font-medium hover:underline text-sm"
              >
                Resend verification code
              </button>
            )}
          </div>
        )}

        {/* Google Sign In */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setApiError('Google sign-in failed')}
            text="signin_with"
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setApiError(''); }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setApiError(''); }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400 cursor-default">Forgot password?</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
