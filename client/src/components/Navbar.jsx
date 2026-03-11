import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, GraduationCap, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = ['/login', '/register', '/admin-login'].includes(location.pathname);

  if (isAuthPage) return null; // Clean: hide navbar on auth pages

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl overflow-hidden shadow-sm border-2 border-white w-10 h-10">
              <img src="/new-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 truncate max-w-[140px] sm:max-w-none">
                Dr. M. SenthilKumar's
              </span>
              <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent leading-none">
                Chemistry Academy
              </span>
            </div>
          </Link>

          {/* Slogan - Center */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <span className="text-sm font-medium text-slate-600 italic tracking-wide">
              "Study together, work together, success together"
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Student Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4" />
              Student SignUp
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-md">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <UserPlus className="h-5 w-5" />
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
