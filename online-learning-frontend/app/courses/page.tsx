"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion'; // Added
import { FiSearch, FiClock, FiUser, FiEdit2, FiTrash2, FiCheck, FiX, FiBookOpen } from 'react-icons/fi'; // Added

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  enrollmentDeadline: string;
  enrolled?: boolean;
  startingdate: string;
  type: string;
  status: string;
}

// Props for CreateCourseForm and EditCourseModal remain the same
interface CreateCourseFormProps {
  onCreated: () => void;
  token: string;
}

interface EditCourseModalProps {
  course: Course | null;
  onClose: () => void;
  onUpdated: () => void;
  token: string;
}

function CreateCourseForm({ onCreated, token }: CreateCourseFormProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    instructor: '',
    enrollmentDeadline: '',
    startingdate: '',
    type: 'online',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/course', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('🎉 Course created successfully!');
      setForm({
        title: '',
        description: '',
        instructor: '',
        enrollmentDeadline: '',
        startingdate: '',
        type: 'online',
        status: 'available',
      });
      onCreated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create course!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12 space-y-6 border border-indigo-100/50" // Enhanced styling
    >
      <div className="flex items-center gap-4 mb-6"> {/* Header added */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <FiBookOpen className="text-2xl" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Create New Course</h3>
          <p className="text-indigo-500">Fill in the details below to create a new course</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
            <span>Course Title</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative"> {/* Wrapper for potential icon (not used here but good practice) */}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Input Course Title"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced input styling
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
            <span>Instructor</span>
            <span className="text-red-500">*</span>
          </label>
           <div className="relative">
            <input
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              required
              placeholder="Input Instructor Name"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced input styling
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
             <span>Start Date</span>
             <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="startingdate"
              value={form.startingdate}
              onChange={handleChange}
              required
              type="datetime-local"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced input styling
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
            <span>Enrollment Deadline</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="enrollmentDeadline"
              value={form.enrollmentDeadline}
              onChange={handleChange}
              required
              type="datetime-local"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced input styling
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
            Course Type
          </label>
          <div className="relative">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 text-gray-800 transition-all hover:border-indigo-300 appearance-none" // Enhanced select styling
            >
              <option value="online">🌐 Online</option>
              <option value="offline">🏫 Offline</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 text-gray-800 transition-all hover:border-indigo-300 appearance-none" // Enhanced select styling
            >
              <option value="available">✅ Available</option>
              <option value="unavailable">❌ Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-1"> {/* Enhanced label */}
          <span>Description</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Detailed course description..."
            rows={4}
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced textarea styling
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={`w-full py-4 text-lg font-semibold text-white rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${ // Enhanced button styling
          loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"> {/* SVG spinner from suggestion */}
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Course...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> {/* Plus icon from suggestion */}
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Course
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

function EditCourseModal({ course, onClose, onUpdated, token }: EditCourseModalProps) {
  const [form, setForm] = useState(course ?? {
    id: '', title: '', description: '', instructor: '', enrollmentDeadline: '', startingdate: '', type: 'online', status: 'available'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (course) setForm(course); }, [course]);
  
  // The suggestion code had this outside the main return, moved it for consistency with AnimatePresence usage later
  // if (!course) return null; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return; // Guard clause
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3000/Course/${course.id}`, { // Kept original endpoint
        description: form.description,
        instructor: form.instructor,
        enrollmentDeadline: form.enrollmentDeadline,
        startingdate: form.startingdate,
        type: form.type,
        status: form.status,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('✅ Course updated successfully!');
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update course!');
    } finally {
      setLoading(false);
    }
  };
  
  // If no course, AnimatePresence will handle the exit, so we don't return null here directly
  // The check is now more for the form submit and initial state
  if (!course) return null;


  return (
    // Outer div for overlay and centering, as per suggestion
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm" // Enhanced styling
      onClick={onClose} // Allow closing by clicking outside
    >
      <motion.form // Changed div to form and applied motion
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }} // Added exit for smoother transition with AnimatePresence
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 border border-indigo-100/50 space-y-6" // Enhanced styling
      >
        <button  
          type="button"  
          onClick={onClose}  
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500" // Enhanced styling
        >
          <FiX className="w-5 h-5" /> {/* Icon from react-icons */}
        </button>
        
        <div className="flex items-center gap-3 mb-6"> {/* Header added */}
          <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-600">
            <FiEdit2 className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Edit Course</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Course Title</label>
            <input 
              value={form.title} 
              disabled 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-800" // Kept original disabled style, matches suggestion's input style base
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <span>Instructor</span>
                <span className="text-red-500">*</span>
            </label>
            <input 
              name="instructor" 
              value={form.instructor} 
              onChange={handleChange} 
              required 
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced styling
            />
          </div>

          <div className="space-y-1">
             <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <span>Start Date</span>
                <span className="text-red-500">*</span>
            </label>
            <input 
              name="startingdate" 
              value={form.startingdate ? new Date(form.startingdate).toISOString().slice(0, 16) : ''} // Ensure correct format for datetime-local
              onChange={handleChange} 
              required 
              type="datetime-local" 
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 text-gray-800 transition-all hover:border-indigo-300" // Enhanced styling
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <span>Enrollment Deadline</span>
                <span className="text-red-500">*</span>
            </label>
            <input 
              name="enrollmentDeadline" 
              value={form.enrollmentDeadline ? new Date(form.enrollmentDeadline).toISOString().slice(0, 16) : ''} // Ensure correct format
              onChange={handleChange} 
              required 
              type="datetime-local" 
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 text-gray-800 transition-all hover:border-indigo-300" // Enhanced styling
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Course Type</label>
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 text-gray-800 transition-all hover:border-indigo-300 appearance-none" // Enhanced styling
            >
              <option value="online">🌐 Online</option>
              <option value="offline">🏫 Offline</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 text-gray-800 transition-all hover:border-indigo-300 appearance-none" // Enhanced styling
            >
              <option value="available">✅ Available</option>
              <option value="unavailable">❌ Unavailable</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <span>Description</span>
            <span className="text-red-500">*</span>
          </label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            required 
            rows={4}
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/90 placeholder-gray-400 text-gray-800 transition-all hover:border-indigo-300" // Enhanced styling
          />
        </div>

        <div className="flex gap-3 pt-4"> {/* Buttons wrapper from suggestion */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="flex-1 py-3 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all" // Enhanced styling
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 font-semibold text-white rounded-xl transition-all ${ // Enhanced styling
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md'
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}


export default function CoursesPage() {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(false); // Renamed to avoid conflict with form loading
  const [now, setNow] = useState(Date.now());
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCourses = async (isInitialLoad = false) => {
    if (isInitialLoad || search.trim() === '' || (search.trim() !== '' && !pageLoading)) {
      setPageLoading(true);
      try {
        let res;
        // Only send Authorization header if token is present
        if (!search.trim()) {
          if (token) {
            res = await axios.get('http://localhost:3000/Course', { headers: { Authorization: `Bearer ${token}` } });
          } else {
            res = await axios.get('http://localhost:3000/Course');
          }
          setCourses(Array.isArray(res.data.course) ? res.data.course : []);
        } else {
          if (token) {
            res = await axios.post('http://localhost:3000/Course/search', { title: search }, { headers: { Authorization: `Bearer ${token}` } });
          } else {
            res = await axios.post('http://localhost:3000/Course/search', { title: search });
          }
          setCourses(Array.isArray(res.data.course) ? res.data.course : []);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        toast.error('❌ Failed to fetch courses!');
      } finally {
        setPageLoading(false);
      }
    }
  };

  // Fetch courses on initial load and when token changes (so guests see courses too)
  useEffect(() => {
    fetchCourses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEdit = (course: Course) => setEditCourse(course);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`http://localhost:3000/Course/${id}`, { headers: { Authorization: `Bearer ${token}` } }); // Kept original endpoint
      toast.success('🗑️ Course deleted successfully!');
      fetchCourses(true); // Refresh list
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete course!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 px-4 py-12"> {/* Enhanced BG */}
      <div className="max-w-7xl mx-auto"> {/* Max width from suggestion */}
        <AnimatePresence> {/* Added for modal animation */}
          {user && user.role?.toLowerCase() === 'admin' && editCourse && (
            <EditCourseModal  
              course={editCourse}  
              onClose={() => setEditCourse(null)}  
              onUpdated={() => fetchCourses(true)} // Refresh list
              token={token as string} // token can be null, ensure it's string
            />
          )}
        </AnimatePresence>
        
        {user && user.role?.toLowerCase() === 'admin' && (
          <CreateCourseForm 
            onCreated={() => { 
              setSearch(''); 
              fetchCourses(true); // Refresh list
            }} 
            token={token as string} // token can be null
          />
        )}

        <motion.div  // Search bar container from suggestion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }} // Delay from suggestion
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-8 border border-gray-200/50" // Enhanced styling
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              fetchCourses(); // Trigger search on submit
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch className="w-5 h-5" /> {/* Icon from react-icons */}
              </div>
              <input
                type="text"
                placeholder="Search courses by title, instructor or description..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white/90 text-gray-800 placeholder-gray-400 transition-all" // Enhanced styling
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"  
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2" // Enhanced styling
            >
              <FiSearch className="w-5 h-5" /> {/* Icon from react-icons */}
              Search
            </motion.button>
          </form>
        </motion.div>

        {pageLoading ? (
          <motion.div  // Loading state from suggestion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16" // Enhanced styling
          >
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-500 mb-4"></div> {/* Spinner from suggestion */}
            <p className="text-lg text-gray-600">Loading courses...</p>
          </motion.div>
        ) : courses.length === 0 ? (
          <motion.div  // No courses state from suggestion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-8 text-center border border-gray-200/50" // Enhanced styling
          >
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500"> {/* Icon wrapper from suggestion */}
              <FiBookOpen className="w-8 h-8" /> {/* Icon from react-icons */}
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search query</p>
            {user?.role?.toLowerCase() === 'admin' && ( // Clear search for admin if no courses
              <button  
                onClick={() => { setSearch(''); fetchCourses(true); }}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors" // Styling from suggestion
              >
                Show all courses
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div  // Courses grid from suggestion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }} // Delay from suggestion
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" // Grid layout from suggestion
          >
            {courses.map(course => {
              const deadline = new Date(course.enrollmentDeadline).getTime();
              const expired = deadline - now <= 0;
              // Original time remaining calculation is removed in favor of suggestion's simpler display

              return (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }} // Hover animation from suggestion
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-200/50 hover:shadow-lg transition-all" // Card styling from suggestion
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{course.title}</h3> {/* Styling from suggestion */}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ // Status badge from suggestion
                        course.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.status === 'available' ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p> {/* Styling from suggestion */}
                    
                    <div className="flex flex-wrap gap-2 mb-4"> {/* Tags from suggestion */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.type === 'online' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {course.type === 'online' ? '🌐 Online' : '🏫 Offline'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        📅 {new Date(course.startingdate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4"> {/* Instructor from suggestion */}
                      <FiUser className="flex-shrink-0" />
                      <span className="truncate">{course.instructor}</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-sm mb-6 ${ // Deadline from suggestion
                      expired ? 'text-red-500' : 'text-indigo-500'
                    }`}>
                      <FiClock className="flex-shrink-0" />
                      <span>
                        {expired 
                          ? 'Enrollment closed' 
                          : `Closes ${new Date(course.enrollmentDeadline).toLocaleDateString()}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center"> {/* Actions wrapper */}
                      {user && user.role?.toLowerCase() === 'admin' ? (
                        <div className="flex gap-2"> {/* Admin buttons from suggestion */}
                          <motion.button  
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(course)}
                            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-1"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            Edit
                          </motion.button>
                          <motion.button  
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(course.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            Delete
                          </motion.button>
                        </div>
                      ) : (
                        <div></div> /* Placeholder if not admin, to maintain layout */
                      )}
                      
                      {user && user.role?.toLowerCase() === 'student' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={expired || !!course.enrolled}
                          onClick={() => {
                            window.location.href = `/payment?courseId=${course.id}`;
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                            course.enrolled
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : expired
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md'
                          }`}
                        >
                          {course.enrolled ? (
                            <>
                              <FiCheck className="w-3.5 h-3.5" />
                              Enrolled
                            </>
                          ) : expired ? (
                            <>
                              <FiX className="w-3.5 h-3.5" />
                              Closed
                            </>
                          ) : (
                            'Enroll Now'
                          )}
                        </motion.button>
                      ) : (
                        !user ? (
                          <a
                            href="/login"
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100"
                            title="Login to enroll in courses"
                            style={{ textDecoration: 'none' }}
                          >
                            <FiUser className="w-4 h-4" />
                            Please log in as a student to enroll in courses.
                          </a>
                        ) : (
                          user.role?.toLowerCase() !== 'student' && user.role?.toLowerCase() !== 'admin' ? (
                            <button
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed flex items-center gap-1"
                              disabled
                              title="Please log in as a student to enroll in courses."
                            >
                              Please log in as a student to enroll in courses.
                            </button>
                          ) : null
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}