import { API_URL } from '../config.js';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Library, FileEdit, Target, FolderOpen, Video, ShieldCheck, X, Bell, Shield, LogOut, Users } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Admin User");
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          if (res.data.name) {
            setUserName(res.data.name);
            localStorage.setItem("userName", res.data.name);
          }
          if (res.data.role) {
            setUserRole(res.data.role);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const links = [
    { path: "/admin-dashboard", name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, active: location.pathname === "/admin-dashboard" },
    { path: "/admin-dashboard/manage-lessons", name: "Manage Lessons", icon: <Library className="h-5 w-5" />, active: location.pathname.startsWith("/admin-dashboard/manage-lessons") },
    { path: "/admin-dashboard/create-unit-tests", name: "Unit Tests", icon: <FileEdit className="h-5 w-5" />, active: location.pathname.startsWith("/admin-dashboard/create-unit-tests") },
    { path: "/admin-dashboard/create-mock-tests", name: "Mock Tests", icon: <Target className="h-5 w-5" />, active: location.pathname.startsWith("/admin-dashboard/create-mock-tests") },
    { path: "/admin-dashboard/study-materials", name: "Study Materials", icon: <FolderOpen className="h-5 w-5" />, active: location.pathname.startsWith("/admin-dashboard/study-materials") },
    { path: "/admin-dashboard/online-classes", name: "Online Classes", icon: <Video className="h-5 w-5" />, active: location.pathname.startsWith("/admin-dashboard/online-classes") },
    { path: "/admin-dashboard/students", name: "Students", icon: <Users className="h-5 w-5" />, active: location.pathname.startsWith("/admin-dashboard/students") },
  ];

  return (
    <div className="h-full flex flex-col bg-white text-slate-900">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600">
          <ShieldCheck className="h-7 w-7" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent tracking-tight">
            Admin Portal
          </span>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Management
        </div>

        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose} // close mobile sidebar on click
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active
              ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            <div className={`${link.active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"}`}>
              {link.icon}
            </div>
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Footer System Status & User Profile */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">{userName}</span>
            <span className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5 capitalize">{userRole}</span>
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
