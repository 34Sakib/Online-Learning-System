"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../../components/ProtectedRoute';

export default function UpdateCoursePage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:3000/course/search', { id: courseId });
        const course = res.data[0];
        setTitle(course.title);
        setDescription(course.description);
        setInstructor(course.instructor);
      } catch (err) {
        toast.error('Failed to fetch course!');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3000/course/${courseId}`, { title, description, instructor }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course updated!');
      router.push('/admin/manage-courses');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="flex justify-center items-center min-h-[60vh]">
        <form onSubmit={handleUpdate} className="card w-96 bg-base-100 shadow-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-2">Update Course</h2>
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
            {loading ? 'Updating...' : 'Update Course'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
