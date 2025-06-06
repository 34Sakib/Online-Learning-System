"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
}

export default function MyCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/enroll', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        toast.error('Failed to fetch your courses!');
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center">You are not enrolled in any courses.</div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="card bg-base-100 shadow-md p-4">
              <h3 className="text-xl font-bold">{course.title}</h3>
              <p>{course.description}</p>
              <span className="text-sm text-gray-500">Instructor: {course.instructor}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
