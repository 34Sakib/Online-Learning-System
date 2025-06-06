"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiKey, FiLock, FiCheckCircle } from "react-icons/fi";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const router = useRouter();

  const handleGetCode = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }
    setCodeLoading(true);
    try {
      await axios.post('http://localhost:3000/user/send-verification-code', { email });
      toast.success('Verification code sent!', {
        icon: '✉️',
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
      toast.error(err?.response?.data?.message || 'Failed to send code!', {
        icon: '⚠️',
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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/user/reset-password', { email, code, newPassword });
      toast.success('Password reset successful!', {
        icon: '✅',
        style: {
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #BBF7D0',
          padding: '16px',
          borderRadius: '12px'
        }
      });
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset failed!', {
        icon: '❌',
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
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="mt-2 text-blue-100">Enter your email to receive a reset code</p>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="p-8 space-y-6">
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

            {/* Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetCode}
                  disabled={codeLoading || !email}
                  className={`px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition ${
                    codeLoading || !email ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {codeLoading ? 'Sending...' : 'Get Code'}
                </button>
              </div>
              {codeSent && (
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <FiCheckCircle /> Code sent successfully!
                </div>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-md transition-all ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Remember your password?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Go to login
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
