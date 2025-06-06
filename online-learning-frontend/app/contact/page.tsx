"use client";
import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiClock, FiUser, FiMessageSquare } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 py-12">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="md:flex">
          {/* Contact Information Sidebar */}
          <div className="md:w-2/5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full opacity-10"></div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="relative z-10"
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8">Let's Connect</motion.h2>
              
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-xl mr-4 mt-1 backdrop-blur-sm">
                    <FiPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-100">Phone</h3>
                    <a href="tel:01641655173" className="text-white hover:underline hover:text-blue-200 block mt-1 transition-colors">
                      +880 1641-655173
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-xl mr-4 mt-1 backdrop-blur-sm">
                    <FiMail className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-100">Email</h3>
                    <a href="mailto:sakibalmahamud34@gmail.com" className="text-white hover:underline hover:text-blue-200 block mt-1 transition-colors">
                      sakibalmahamud34@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-xl mr-4 mt-1 backdrop-blur-sm">
                    <FiMapPin className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-100">Location</h3>
                    <p className="text-white mt-1">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-12">
                <h3 className="font-semibold text-blue-100 mb-4 flex items-center">
                  <FiClock className="mr-2" />
                  Business Hours
                </h3>
                <ul className="space-y-3 text-white">
                  <li className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>Monday - Friday</span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>Saturday</span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span>Sunday</span>
                    <span className="text-white/70">Closed</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="md:w-3/5 p-8 md:p-12">
            {submitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <FiCheckCircle className="mx-auto text-6xl text-green-500 mb-6 animate-pulse" />
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Message Sent Successfully!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all shadow-md"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-3">
                  Get In Touch
                </motion.h1>
                <motion.p variants={itemVariants} className="text-gray-600 mb-8 text-lg">
                  Have questions about our courses or services? We're here to help!
                </motion.p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400 text-gray-800 transition-all hover:border-gray-400"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400 text-gray-800 transition-all hover:border-gray-400"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message*</label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-4 top-4 text-gray-400" />
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400 text-gray-800 transition-all hover:border-gray-400"
                        placeholder="How can we assist you today?"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center shadow-md relative overflow-hidden"
                      disabled={loading}
                    >
                      {loading && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5 }}
                          className="absolute bottom-0 left-0 h-1 bg-white/30"
                        />
                      )}
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-3" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}