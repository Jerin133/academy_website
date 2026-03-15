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
        <div className="flex flex-col">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="rounded-xl overflow-hidden shadow-md border-2 border-white w-12 h-12">
                <img src="/new-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest leading-none">
                  Dr. M. SenthilKumar's
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent leading-none pb-0.5 -mt-0.5">
                  Chemistry Academy
                </span>
              </div>
            </Link>

            {/* Slogan - Center (desktop) */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <span className="text-sm font-medium text-slate-600 italic tracking-wide">
                "Study together, work together, success together"
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Student Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
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

          {/* Slogan - Mobile (below logo row) */}
          <div className="lg:hidden flex justify-center pb-2 -mt-1">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 italic tracking-wide">
              "Study together, work together, success together"
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-lg font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn className="h-6 w-6" />
              Student Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <UserPlus className="h-6 w-6" />
              Student SignUp
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
