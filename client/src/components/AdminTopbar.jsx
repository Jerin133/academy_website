import { useNavigate } from "react-router-dom";
import { Menu, Bell, Shield, LogOut } from "lucide-react";

export default function AdminTopbar({ onMenuClick }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10 w-full transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          <h1 className="font-bold text-lg text-slate-900">
            Control Panel
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 border border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 leading-none">Admin User</span>
            <span className="text-xs text-indigo-600 font-medium mt-1">Superuser</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-sm">
            <Shield className="h-5 w-5" />
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
