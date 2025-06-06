"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful! Welcome back!', {
        style: {
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #BBF7D0',
          padding: '16px',
          borderRadius: '12px'
        },
        iconTheme: {
          primary: '#16A34A',
          secondary: '#FFFFFF'
        }
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.', {
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FECACA',
          padding: '16px',
          borderRadius: '12px'
        },
        iconTheme: {
          primary: '#DC2626',
          secondary: '#FFFFFF'
        }
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-blue-100">Sign in to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <a
                  href="/reset-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={formLoading || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-md transition-all ${
                formLoading || loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {formLoading || loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login <FiArrowRight />
                </span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline font-medium">
                Create one
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}