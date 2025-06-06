"use client";
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
    password: '',
    dateOfBirth: '',
    role: 'student',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetCode = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first.', {
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FECACA',
          padding: '16px',
          borderRadius: '12px'
        }
      });
      return;
    }
    
    setCodeLoading(true);
    try {
      await axios.post('http://localhost:3000/user/send-verification-code', { email: formData.email });
      toast.success('Verification code sent to your email!', {
        style: {
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #BBF7D0',
          padding: '16px',
          borderRadius: '12px'
        }
      });
      setCodeSent(true);
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.message || 'Failed to send code!';
      toast.error(backendMsg, {
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FECACA',
          padding: '16px',
          borderRadius: '12px'
        }
      });
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/user/signup', formData);
      toast.success('Account created successfully!', {
        style: {
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #BBF7D0',
          padding: '16px',
          borderRadius: '12px'
        },
        icon: <FiCheckCircle className="text-green-600" />
      });
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Signup failed. Please try again.', {
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FECACA',
          padding: '16px',
          borderRadius: '12px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">Join Our Platform</h1>
            <p className="mt-2 text-blue-100">Create your account in just a few steps</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Verification Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiSend className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="code"
                    placeholder="Verification Code"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={handleGetCode}
                  disabled={codeLoading || !formData.email}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap ${
                    codeLoading || !formData.email
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } transition-all`}
                >
                  {codeLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-blue-700" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Get Code'
                  )}
                </motion.button>
              </div>
              {codeSent && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <FiCheckCircle /> Verification code sent to your email
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="1234567890"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select
                name="role"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-md transition-all ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}