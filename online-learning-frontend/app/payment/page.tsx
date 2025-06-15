"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion"; // Added for animations
import { FiCreditCard, FiArrowLeft, FiLoader, FiAlertCircle, FiBookOpen, FiUser, FiCalendar, FiDollarSign } from "react-icons/fi"; // Added for icons

// Interface for Course (assuming a similar structure to previous examples)
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  enrollmentDeadline: string;
  startingdate: string;
  type: string;
  status: string;
  price?: number; // Added price, assuming it might come from the backend
}


export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true); // Separate loading for course details
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchCourseDetails() {
      if (!courseId) {
        toast.error("No course ID provided.");
        setLoadingCourse(false);
        return;
      }
      setLoadingCourse(true);
      try {
        // Ensure token is available before making the request
        if (!token) {
          // Optionally, wait for token or redirect if not expected to be available soon
          // For now, we'll proceed, but API might fail if token is required and missing
          console.warn("Attempting to fetch course details without a token.");
        }
        const res = await axios.get(`http://localhost:3000/course/${courseId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to load course info:", err);
        toast.error("Failed to load course information.");
        // If the course doesn't exist or there's an error,
        // it might be good to redirect or show a more specific error message.
        // For now, course will remain null.
      } finally {
        setLoadingCourse(false);
      }
    }
    fetchCourseDetails();
  }, [courseId, token]); // Added token as a dependency

  const handlePay = async () => {
    if (!user) {
      toast.error("Please log in to complete the payment.");
      // Consider redirecting to login page: router.push('/login?redirect=/payment?courseId=' + courseId);
      return;
    }
    if (!course) {
      toast.error("Course details are not available. Cannot proceed with payment.");
      return;
    }
    setProcessingPayment(true);
    try {
      const res = await axios.post('http://localhost:3000/payment/create-checkout-session', {
        courseId,
        userEmail: user.email
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe Checkout
      } else {
        toast.error('Could not retrieve payment URL.');
      }
    } catch (err: any) {
      console.error('Payment initiation failed:', err);
      toast.error(err?.response?.data?.message || 'Payment initiation failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!courseId && !loadingCourse) { // Show error if no courseId and not loading
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-red-200"
        >
          <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 mb-3">Payment Error</h2>
          <p className="text-gray-600 mb-6">No course was selected for payment. Please go back and select a course.</p>
          <button
            onClick={() => router.push('/courses')} // Navigate to courses page
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft />
            Back to Courses
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full border border-indigo-100/50"
      >
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <FiCreditCard className="text-3xl" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Confirm Your Enrollment</h2>
                <p className="text-indigo-500">Securely complete your payment to join the course.</p>
            </div>
        </div>

        {loadingCourse ? (
          <div className="flex flex-col items-center justify-center py-10">
            <FiLoader className="animate-spin text-4xl text-indigo-500 mb-4" />
            <p className="text-gray-600">Loading course details...</p>
          </div>
        ) : course ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-3"
          >
            <div className="flex items-center text-2xl font-semibold text-gray-800">
                <FiBookOpen className="text-indigo-500 mr-3 text-2xl flex-shrink-0"/>
                {course.title}
            </div>
            <div className="text-gray-700 flex items-center">
                <FiUser className="text-indigo-500 mr-3 text-lg flex-shrink-0"/>
                Instructor: {course.instructor}
            </div>
            <div className="text-gray-700 flex items-center">
                <FiCalendar className="text-indigo-500 mr-3 text-lg flex-shrink-0"/>
                Start Date: {new Date(course.startingdate).toLocaleDateString()}
            </div>
            <div className="text-gray-700 flex items-center text-xl font-medium pt-2">
                <FiDollarSign className="text-green-500 mr-2 text-2xl flex-shrink-0"/>
                Price: <span className="text-green-600 font-bold">${course.price || 99}.00</span> {/* Display price */}
            </div>
          </motion.div>
        ) : (
          <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-200 text-center">
            <FiAlertCircle className="text-3xl text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Could not load course details.</p>
            <p className="text-gray-600 text-sm">Please try again or contact support.</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(96, 91, 255, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePay}
          disabled={processingPayment || loadingCourse || !course || !user}
          className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3
            ${(processingPayment || loadingCourse || !course || !user)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-xl'
            }`}
        >
          {processingPayment ? (
            <>
              <FiLoader className="animate-spin text-xl" />
              Processing Payment...
            </>
          ) : (
            <>
              <FiCreditCard className="text-xl" />
              Pay Now & Enroll
            </>
          )}
        </motion.button>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            disabled={processingPayment}
            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-300 text-sm font-medium flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
          >
            <FiArrowLeft />
            Cancel and go back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
