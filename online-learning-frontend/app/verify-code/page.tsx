"use client";
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/user/send-verification-code', { email });
      toast.success('Verification code sent!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send code!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/user/verify-code', { email, code });
      toast.success('Email verified! You can now log in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Verification failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form onSubmit={handleVerify} className="card w-96 bg-base-100 shadow-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Verify Email</h2>
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Verification Code"
            className="input input-bordered flex-1"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <button type="button" className="btn btn-outline btn-primary" onClick={handleSendCode} disabled={loading}>
            Send Code
          </button>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}
