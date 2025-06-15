"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  FaUserCircle, FaDownload, FaSave, FaEdit, FaBookOpen, 
  FaGraduationCap, FaChartLine, FaUsers, FaUserTie, FaTrophy,
  FaCertificate, FaClock, FaCalendarAlt, FaMobileAlt, FaEnvelope
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FiActivity, FiAward, FiBarChart2, FiBookmark } from 'react-icons/fi';

export default function ProfilePage() {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
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
    currentStreak: 0,
    points: 0
  });

  const isAdmin = user?.role && user.role.toLowerCase() === 'admin';

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
          
          // Calculate dynamic stats
          const now = new Date();
          let coursesCompleted = 0;
          let learningHours = 0;
          let certificatesEarned = 0;
          let currentStreak = 0;
          let points = 0;
          let completedCourses: any[] = [];
          let recentActivity: any[] = [];

          (coursesRes.data.courses || []).forEach((course: any) => {
            const endDate = course.endDate ? new Date(course.endDate) : null;
            if (course.durationHours) {
              learningHours += Number(course.durationHours);
            }
            const isCompleted = (endDate && endDate < now) || course.progress === 100;
            if (isCompleted) {
              coursesCompleted++;
              certificatesEarned++;
              points += 100; // 100 points per completed course
              completedCourses.push(course);
              recentActivity.push({
                action: 'Completed',
                course: course.title,
                time: endDate ? endDate.toLocaleDateString() : 'Recently',
                color: 'emerald',
                icon: FaCertificate
              });
            } else {
              recentActivity.push({
                action: 'Progress',
                course: course.title,
                time: 'In progress',
                color: 'blue',
                icon: FaBookOpen
              });
            }
          });

          // Add some mock activity
          recentActivity.unshift({
            action: 'Achievement',
            description: 'Reached Silver Level',
            time: 'Today',
            color: 'purple',
            icon: FaTrophy
          });

          if (completedCourses.length > 0) currentStreak = 7;
          setStats({
            coursesCompleted,
            certificatesEarned,
            learningHours,
            currentStreak,
            points
          });

          setRecentActivity(recentActivity.slice(0, 5));
          setCompletedCourses(completedCourses);

          // If admin, fetch student enrollments
          if (isAdmin) {
            setLoadingStudents(true);
            const studentsRes = await axios.get('http://localhost:3000/user/all-enrollments', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (Array.isArray(studentsRes.data)) {
              setStudentEnrollments(studentsRes.data);
            } else {
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
      toast.success('Updated!', {
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
    <div className="min-h-[90vh] bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className={`bg-gradient-to-r ${isAdmin ? 'from-blue-600 via-cyan-600 to-teal-600' : 'from-indigo-600 via-purple-600 to-pink-600'} rounded-t-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex flex-col items-start gap-2 md:gap-4 mb-6 md:mb-0">
  <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-1">
    {(user as any)?.name || `${firstName} ${lastName}`}
  </span>

  <div className="flex items-center gap-4 md:gap-6">

              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-white/20 p-3 md:p-4 rounded-full backdrop-blur-sm border-2 border-white/30 shadow-lg"
              >
                {isAdmin ? (
                  <FaUserTie className="text-4xl md:text-5xl text-white" />
                ) : (
                  <FaUserCircle className="text-4xl md:text-5xl text-white" />
                )}
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  {firstName} {lastName}
                </h1>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-white/20 rounded-full">
                    {isAdmin ? 'Administrator' : 'Learner'}
                  </span>
                  <span>•</span>
                  
                </p>
              </div>
            </div>
          </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 md:px-6 py-2 bg-white/20 rounded-full text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 md:px-6 py-2 bg-white rounded-full text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-md"
              >
                <FaDownload /> {downloading ? 'Preparing...' : 'Download'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b">
            {!isAdmin && (
              <StatCard 
                icon={<FaBookOpen className="text-xl" />}
                title="Courses Enrolled"
                value={enrolledCourses.length}
                color="indigo"
                gradient="from-indigo-500 to-purple-500"
              />
            )}
            <StatCard 
              icon={<FaUsers className="text-xl" />}
              title="Total Students"
              value={isAdmin ? studentEnrollments.length : stats.coursesCompleted}
              color="blue"
              gradient="from-blue-500 to-cyan-500"
            />
            <StatCard 
              icon={<FaUserCircle className="text-xl" />}
              title="Active Students"
              value={isAdmin ? studentEnrollments.filter(s => s.status === 'active').length : stats.certificatesEarned}
              color="green"
              gradient="from-green-500 to-emerald-500"
            />
            <StatCard 
              icon={<FaChartLine className="text-xl" />}
              title="New This Month"
              value={isAdmin ? studentEnrollments.filter(s => {
                // Only count if joinDate exists, is a valid date, and user is a student
                const joinDate = s.joinDate ? new Date(s.joinDate) : null;
                if (!joinDate || isNaN(joinDate.getTime())) return false;
                // If you have a role field, check for student
                if (s.role && s.role.toLowerCase() !== 'student') return false;
                const now = new Date();
                return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
              }).length : stats.learningHours}
              color="amber"
              gradient="from-amber-500 to-yellow-500"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Profile Information */}
            <div className={`space-y-6 ${isAdmin ? 'md:col-span-1' : 'md:col-span-2'}`}>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                          isEditing 
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white shadow-sm'
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
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white shadow-sm'
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
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaEnvelope className="text-sm" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                          isEditing 
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white shadow-sm'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaMobileAlt className="text-sm" />
                      </div>
                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="012345678"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                          isEditing 
                            ? 'border-indigo-300 focus:ring-indigo-200 bg-white shadow-sm'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {!isAdmin && (
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaCalendarAlt className="text-sm" />
                        </div>
                        <input
                          id="dateOfBirth"
                          type="date"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                            isEditing 
                              ? 'border-indigo-300 focus:ring-indigo-200 bg-white shadow-sm'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          }`}
                          value={dateOfBirth}
                          onChange={e => setDateOfBirth(e.target.value)}
                          required
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-2">
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
              <div className={`bg-gradient-to-br ${isAdmin ? 'from-blue-50 to-cyan-50' : 'from-purple-50 to-indigo-50'} p-6 rounded-xl border ${isAdmin ? 'border-blue-200' : 'border-purple-200'} shadow-sm`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                  <FaDownload className={`${isAdmin ? 'text-blue-600' : 'text-purple-600'}`} />
                  <span>Account Data</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isAdmin 
                    ? 'Download administrative reports and student data in PDF format.' 
                    : 'Download your personal data, certificates, and learning progress in PDF format.'}
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
                      Preparing...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download {isAdmin ? 'Admin Data' : 'My Data'}
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Main Content Area - Different for Admin vs Student */}
            <div className={`space-y-6 ${isAdmin ? 'md:col-span-2' : 'md:col-span-1'}`}>
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
                                      ? 'bg-green-100 text-green-800' 
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
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white">
                        <FiAward className="text-xl" />
                      </div>
                      <span>Learning Achievements</span>
                    </h3>
                    <div className="space-y-4">
                      <AchievementItem 
                        icon={<FaTrophy className="text-xl" />}
                        title={`${stats.currentStreak}-Day Streak`}
                        description="Keep learning to maintain your streak!"
                        color="amber"
                        progress={Math.min(100, (stats.currentStreak / 30) * 100)}
                      />
                      <AchievementItem 
                        icon={<FaChartLine className="text-xl" />}
                        title={`${stats.learningHours} Learning Hours`}
                        description="You're in the top 20% of learners!"
                        color="blue"
                        progress={Math.min(100, (stats.learningHours / 100) * 100)}
                      />
                      <AchievementItem 
                        icon={<FaBookOpen className="text-xl" />}
                        title={`${stats.coursesCompleted} Courses Completed`}
                        description="3 more for your next milestone!"
                        color="indigo"
                        progress={Math.min(100, (stats.coursesCompleted / 10) * 100)}
                      />
                      <AchievementItem 
                        icon={<FaCertificate className="text-xl" />}
                        title={`${stats.points} Points Earned`}
                        description="Earn more points to unlock rewards"
                        color="purple"
                        progress={Math.min(100, (stats.points / 1000) * 100)}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white">
                        <FiActivity className="text-xl" />
                      </div>
                      <span>Recent Activity</span>
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className={`mt-1 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-${activity.color}-100 text-${activity.color}-600`}>
                              <activity.icon className="text-sm" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                <span className={`text-${activity.color}-600`}>{activity.action}</span> {activity.course || activity.description}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <FaClock className="text-xs" /> {activity.time}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No recent activity yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Student Courses Section (only for students) */}
            {!isAdmin && (
              <div className="md:col-span-3 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white">
                    <FaBookOpen className="text-xl" />
                  </div>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Your Learning Journey
                  </span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrolledCourses.map((course: any) => {
                      let percent = 0;
                      if (course.startDate && course.endDate) {
                        const start = new Date(course.startDate);
                        const end = new Date(course.endDate);
                        const now = new Date();
                        if (now >= end) {
                          percent = 100;
                        } else {
                          const total = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                          const elapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                          percent = total > 0 ? Math.max(0, Math.min(100, Math.round((elapsed / total) * 100))) : 0;
                        }
                      } else if (course.progress !== undefined) {
                        percent = course.progress;
                      } else {
                        percent = 0;
                      }
                      return (
                        <motion.div 
                          key={course.id} 
                          whileHover={{ y: -5 }}
                          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${percent === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'}`}>
                              <FaBookOpen className="text-xl" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{course.courseName || course.title || 'Untitled Course'}</h4>
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${percent === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-blue-400 to-indigo-400'}`} 
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-xs text-gray-500">{percent}% complete</p>
                                  <p className="text-xs text-gray-500">
                                    {course.durationHours ? `${course.durationHours} hrs` : ''}
                                  </p>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`mt-4 text-sm font-medium px-4 py-2 rounded-lg ${
                                  percent === 100 
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200'
                                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200'
                                } transition-all`}
                              >
                                {percent === 100 ? 'View Certificate' : 'Continue Learning'}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                      <FaBookOpen className="text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No courses enrolled yet</h4>
                    <p className="text-gray-500 mb-4">Discover our courses and start your learning journey today</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-md hover:shadow-lg"
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

// Stat Card Component
function StatCard({ icon, title, value, color, gradient }: { icon: React.ReactNode, title: string, value: number, color: string, gradient: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
    >
      <div className={`p-3 rounded-full bg-gradient-to-r ${gradient} text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
    </motion.div>
  );
}

// Achievement Item Component
function AchievementItem({ icon, title, description, color, progress }: { icon: React.ReactNode, title: string, description: string, color: string, progress: number }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-xs">
      <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full bg-${color}-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}