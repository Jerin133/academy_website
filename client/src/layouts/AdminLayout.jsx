import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { Menu, ShieldCheck } from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-slate-50 h-screen overflow-hidden flex font-sans text-slate-900">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto focus:outline-none bg-white border-r border-slate-200 shadow-xl lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm z-10 w-full transition-all">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <ShieldCheck className="h-6 w-6" /> Control Panel
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mr-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}