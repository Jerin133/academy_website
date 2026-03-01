import { API_URL } from '../config.js';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Target, CalendarDays, GraduationCap, X, Bell, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Student");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.name) {
          setUserName(res.data.name);
          localStorage.setItem("userName", res.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const isLessonsActive =
    location.pathname.startsWith("/dashboard/lessons") ||
    location.pathname.startsWith("/dashboard/attempt-test") ||
    location.pathname.startsWith("/dashboard/materials");

  const links = [
    { path: "/dashboard", name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, active: location.pathname === "/dashboard" },
    { path: "/dashboard/lessons", name: "Lessons", icon: <BookOpen className="h-5 w-5" />, active: isLessonsActive },
    { path: "/dashboard/mock-tests", name: "Mock Tests", icon: <Target className="h-5 w-5" />, active: location.pathname.startsWith("/dashboard/mock-tests") },
    { path: "/dashboard/online-classes", name: "Online Classes", icon: <CalendarDays className="h-5 w-5" />, active: location.pathname.startsWith("/dashboard/online-classes") },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-sm text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
              Dr. M. SenthilKumar's
            </span>
            <span className="text-lg font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent leading-none tracking-tight">
              Academy
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>

        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose} // close mobile sidebar on click
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active
              ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            {/* The icon */}
            <div className={`${link.active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
              {link.icon}
            </div>
            {link.name}
          </Link>
        ))}
      </nav>

      {/* User Profile & Actions Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">{userName}</span>
            <span className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">Learner</span>
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}