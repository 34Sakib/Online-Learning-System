"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  FaUserCircle, FaDownload, FaSave, FaEdit, FaBookOpen, 
  FaGraduationCap, FaChartLine, FaUsers, FaUserTie 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '');
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    certificatesEarned: 0,
    learningHours: 0,
    currentStreak: 0
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      if (user && token) {
        setLoadingCourses(true);
        
        try {
          // Fetch enrolled courses for the current user
          const coursesRes = await axios.get('http://localhost:3000/user/enrolled-courses', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnrolledCourses(coursesRes.data.courses || []);
          
          // Mock stats - replace with actual API calls
          setStats({
            coursesCompleted: Math.min(5, coursesRes.data.courses?.length || 0),
            certificatesEarned: Math.min(3, coursesRes.data.courses?.length || 0),
            learningHours: 42,
            currentStreak: 7
          });

          // If admin, fetch student enrollments
          if (isAdmin) {
            setLoadingStudents(true);
            const studentsRes = await axios.get('http://localhost:3000/user/all-enrollments', {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Admin all-enrollments API response:', studentsRes.data);
            if (Array.isArray(studentsRes.data)) {
              setStudentEnrollments(studentsRes.data);
            } else if (studentsRes.data && studentsRes.data.message === 'Forbidden') {
              setStudentEnrollments([]);
              toast.error('You are not authorized to view student enrollments.', {
                style: {
                  background: '#EF4444',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }
              });
            } else {
              setStudentEnrollments([]);
              toast.error('Unexpected response from server.', {
                style: {
                  background: '#EF4444',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }
              });
            }
          }
        } catch (err) {
          console.error('Failed to fetch data:', err);
          toast.error('Failed to load data', {
            style: { 
              background: '#EF4444',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }
          });
        } finally {
          setLoadingCourses(false);
          setLoadingStudents(false);
        }
      }
    };

    fetchData();
  }, [user, token, isAdmin]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.post('http://localhost:3000/user/profile/update', {
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!', {
        style: { 
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed!', {
        style: { 
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const endpoint = isAdmin 
        ? 'http://localhost:3000/admin/download-info' 
        : 'http://localhost:3000/user/download-info';
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', isAdmin ? 'admin-data.pdf' : 'user-info.pdf');
      document.body.appendChild(link);
      link.click();
      
      toast.success(`${isAdmin ? 'Admin' : 'User'} data downloaded!`, {
        style: { 
          background: '#3B82F6',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }
      });
    } catch (err: any) {
      toast.error('Download failed!', {
        style: { 
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <div className={`bg-gradient-to-r ${isAdmin ? 'from-blue-600 to-cyan-600' : 'from-indigo-600 to-purple-600'} rounded-t-3xl p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                {isAdmin ? (
                  <FaUserTie className="text-5xl text-white" />
                ) : (
                  <FaUserCircle className="text-5xl text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name || 'User Profile'}</h1>
                <p className="text-indigo-100 mt-1">
                  {isAdmin ? 'Administrator Dashboard' : 'Student Learning Dashboard'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-white/20 rounded-full text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <FaEdit /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-2 bg-white rounded-full text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <FaDownload /> {downloading ? 'Preparing...' : 'Download Data'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center gap-4"
            >
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <FaBookOpen className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'Total Courses' : 'Courses Enrolled'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isAdmin ? studentEnrollments.reduce((acc, curr) => acc + curr.courses.length, 0) : enrolledCourses.length}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex items-center gap-4"
            >
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                {isAdmin ? <FaUsers className="text-xl" /> : <FaGraduationCap className="text-xl" />}
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'Total Students' : 'Courses Completed'}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isAdmin ? studentEnrollments.length : stats.coursesCompleted}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 flex items-center gap-4"
            >
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <FaGraduationCap className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'Active Students' : 'Certificates'}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {isAdmin ? studentEnrollments.filter(s => s.status === 'active').length : stats.certificatesEarned}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center gap-4"
            >
              <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                <FaChartLine className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'New This Month' : 'Learning Hours'}
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {isAdmin ? studentEnrollments.filter(s => {
                    const joinDate = new Date(s.joinDate);
                    const now = new Date();
                    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                  }).length : stats.learningHours}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 p-8">
            {/* Profile Information */}
            <div className={`space-y-8 ${isAdmin ? 'md:col-span-1' : 'md:col-span-2'}`}>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                          isEditing 
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                          isEditing 
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                        isEditing 
                          ? 'border-indigo-300 focus:ring-indigo-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Your phone number"
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                        isEditing 
                          ? 'border-indigo-300 focus:ring-indigo-200 bg-white'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  {!isAdmin && (
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                          isEditing 
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        value={dateOfBirth}
                        onChange={e => setDateOfBirth(e.target.value)}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={updating}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white ${
                        isAdmin 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      } transition-all shadow-md ${
                        updating ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {updating ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </form>

              {/* Download Section */}
              <div className={`bg-gradient-to-br ${isAdmin ? 'from-blue-50 to-cyan-50' : 'from-purple-50 to-indigo-50'} p-6 rounded-xl border ${isAdmin ? 'border-blue-100' : 'border-purple-100'}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isAdmin 
                    ? 'Download administrative reports and student data.' 
                    : 'Download a copy of your personal data, certificates, and learning progress.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-semibold text-white ${
                    isAdmin 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                  } transition-all shadow-md`}
                >
                  {downloading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z" />
                      </svg>
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download {isAdmin ? 'Admin Data' : 'My Data'} (PDF)
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Main Content Area - Different for Admin vs Student */}
            <div className={`space-y-8 ${isAdmin ? 'md:col-span-2' : 'md:col-span-1'}`}>
              {isAdmin ? (
                <>
                  {/* Admin-Specific Content */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white">
      <FaUsers className="text-xl" />
    </div>
    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
      Student Enrollments
    </span>
  </h3>
  
  {loadingStudents ? (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z" />
        </svg>
      </div>
      <p className="text-gray-600 font-medium">Loading student data...</p>
    </div>
  ) : studentEnrollments.length > 0 ? (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Courses
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {studentEnrollments.map((student) => (
            <tr 
              key={student.id} 
              className="hover:bg-blue-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FaUserCircle className="text-lg" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-xs text-blue-600">
                      Joined: {new Date(student.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-800 font-medium">
                  {student.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                    {student.courses.length} courses
                  </span>
                  <div className="text-sm text-gray-600">
                    {student.courses.slice(0, 2).map(c => c.name).join(', ')}
                    {student.courses.length > 2 && '...'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800 animate-pulse' 
                    : student.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
      <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
        <FaUsers className="text-2xl" />
      </div>
      <h4 className="text-lg font-medium text-gray-700 mb-2">No student enrollments found</h4>
      <p className="text-gray-500 mb-4">When students enroll, they'll appear here</p>
      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
        Refresh Data
      </button>
    </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Student-Specific Content */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">Learning Achievements</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-full text-white">
                            <FaGraduationCap />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{stats.currentStreak}-Day Streak</p>
                          <p className="text-sm text-gray-500">Keep learning to maintain your streak!</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <div className="bg-gradient-to-r from-green-400 to-green-500 p-2 rounded-full text-white">
                            <FaChartLine />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{stats.learningHours} Learning Hours</p>
                          <p className="text-sm text-gray-500">You're in the top 20% of learners!</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-2 rounded-full text-white">
                            <FaBookOpen />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{stats.coursesCompleted} Courses Completed</p>
                          <p className="text-sm text-gray-500">3 more for your next milestone!</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'Completed', course: 'JavaScript Fundamentals', time: '2 hours ago', color: 'green' },
                        { action: 'Started', course: 'React Advanced Patterns', time: '1 day ago', color: 'blue' },
                        { action: 'Earned', course: 'Python Certificate', time: '3 days ago', color: 'purple' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              <span className={`text-${activity.color}-600`}>{activity.action}</span> {activity.course}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Student Courses Section (only for students) */}
            {!isAdmin && (
              <div className="md:col-span-3 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <FaBookOpen className="text-indigo-600" /> Your Learning Journey
                </h3>
                {loadingCourses ? (
                  <div className="text-center py-4">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z" />
                    </svg>
                    <p className="text-gray-500 mt-2">Loading your courses...</p>
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.map((course: any) => (
                      <motion.div 
                        key={course.id} 
                        whileHover={{ y: -5 }}
                        className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${course.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            <FaBookOpen className="text-xl" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{course.title || 'Course Title Missing'}</h4>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                                  style={{ width: `${course.progress || 0}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{course.progress || 0}% complete</p>
                            </div>
                            <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                              {course.progress === 100 ? 'View Certificate' : 'Continue Learning'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium"
                    >
                      Browse Courses
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
