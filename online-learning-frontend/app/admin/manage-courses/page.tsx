"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
}

export default function ManageCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/course/search', {});
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to fetch courses!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`http://localhost:3000/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Course deleted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Delete failed!');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="text-center">No courses found.</div>
          ) : (
            courses.map(course => (
              <div key={course.id} className="card bg-base-100 shadow-md p-4 flex flex-col gap-2">
                <h3 className="text-xl font-bold">{course.title}</h3>
                <p>{course.description}</p>
                <span className="text-sm text-gray-500">Instructor: {course.instructor}</span>
                <div className="flex gap-2 mt-2">
                  <Link href={`/admin/update-course/${course.id}`} className="btn btn-info btn-sm">Edit</Link>
                  <button className="btn btn-error btn-sm" onClick={() => handleDelete(course.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
