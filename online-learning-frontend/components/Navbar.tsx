"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
    } catch (e) {}
    logout();
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Profile", href: "/profile", auth: true },
  ]; // About is always visible

  return (
    <nav className="w-full bg-white/70 backdrop-blur shadow-lg px-6 md:px-12 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo Left */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text hover:scale-105 transition-transform duration-200"
        >
          Online Learning
        </Link>

        {/* Navigation Right */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {navItems.map((item) => {
            if (item.admin && (!user || user.role !== "Admin")) return null;
            if (item.auth && !user) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-200 ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500 text-white px-4 py-1.5 text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className={`rounded-full border border-indigo-500 text-indigo-600 px-4 py-1.5 text-sm font-semibold hover:bg-indigo-100 transition ${
                  pathname === "/login" ? "bg-indigo-500 text-white" : ""
                }`}
              >
                Login
              </button>
              <Link
                href="/signup"
                className={`rounded-full bg-indigo-600 text-white px-4 py-1.5 text-sm font-semibold hover:bg-indigo-700 transition ${
                  pathname === "/signup" ? "shadow-lg" : ""
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
