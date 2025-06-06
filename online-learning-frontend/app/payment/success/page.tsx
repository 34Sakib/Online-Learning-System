"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("courseId");
  const [status, setStatus] = useState<'pending'|'success'|'error'>("pending");

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId || !courseId || !user) return;
      try {
        await axios.post(
          "http://localhost:3000/payment/verify",
          { sessionId, courseId, userId: user.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatus("success");
        toast.success("Payment verified and enrollment successful!");
        setTimeout(() => router.push("/profile"), 3000);
      } catch (err) {
        setStatus("error");
        toast.error("Payment verification or enrollment failed.");
      }
    }
    verifyPayment();
  }, [sessionId, courseId, user, token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-pink-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
          {status === "pending" && "Verifying Payment..."}
          {status === "success" && "Payment Successful!"}
          {status === "error" && "Payment Failed"}
        </h2>
        {status === "pending" && <div className="text-gray-500">Please wait while we verify your payment.</div>}
        {status === "success" && <div className="text-green-600">You have been enrolled in the course. Redirecting...</div>}
        {status === "error" && <div className="text-red-600">Payment verification or enrollment failed. Please contact support.</div>}
      </div>
    </div>
  );
}
