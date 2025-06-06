"use client";
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AddCoursePage() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/course/', { title, description, instructor }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course added!');
      setTitle('');
      setDescription('');
      setInstructor('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add course!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="flex justify-center items-center min-h-[60vh]">
        <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-2">Add Course</h2>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="input input-bordered w-full"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Instructor"
            className="input input-bordered w-full"
            value={instructor}
            onChange={e => setInstructor(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Course'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
