import { API_URL } from '../../config.js';
import { Link } from "react-router-dom";
import { Library, FileEdit, Target, Users, BookOpen, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Admin");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch User
        if (token) {
          const userRes = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (userRes.data && userRes.data.name) {
            setUserName(userRes.data.name);
            localStorage.setItem("userName", userRes.data.name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin user data:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {userName} 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Manage your institution's content, complete workflows, and review progress.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-medium text-sm border border-indigo-100 shadow-sm">
          <span>System updated just now</span>
        </div>
      </div>

      {/* Featured Management Banner Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-white/10">
            System Notice
          </div>
          <h3 className="text-4xl font-extrabold mb-4 leading-tight">Prepare for the 2026 Curriculum</h3>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed font-medium">
            It is time to organize the next semester's materials! Ensure all lessons, subjects, and mock tests are published for students to access.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="manage-lessons" className="bg-white text-indigo-700 hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md">
              <Library className="h-5 w-5" /> Start Publishing
            </Link>
            <Link to="create-mock-tests" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md">
              <Target className="h-5 w-5" /> Schedule Exams
            </Link>
          </div>
        </div>
        <div className="relative z-10 hidden md:flex flex-col gap-4 transform rotate-2 hover:-rotate-1 transition-transform duration-500">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex items-center gap-4 w-64 shadow-xl">
            <div className="bg-white/20 p-3 rounded-xl shrink-0"><Users className="h-6 w-6 text-white" /></div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Active Accounts</p>
              <p className="text-white font-bold text-xl">All Synced</p>
            </div>
          </div>
          <div className="bg-black/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4 w-64 shadow-xl ml-8">
            <div className="bg-white/20 p-3 rounded-xl shrink-0"><BookOpen className="h-6 w-6 text-white" /></div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Curriculum Status</p>
              <p className="text-white font-bold text-xl">Ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Essential Workflows</h3>
      </div>

      {/* Management Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Manage Lessons */}
        <Link to="manage-lessons" className="group block">
          <div className="bg-white h-full p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>

            <div className="w-16 h-16 bg-blue-100/80 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              Manage Lessons
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Create and organize extensive subject categories and structured learning materials.
            </p>
            <div className="flex items-center text-blue-600 font-bold text-sm bg-blue-50 w-max px-4 py-2 rounded-lg group-hover:bg-blue-100 transition-colors">
              Open Module <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Create Unit Tests */}
        <Link to="create-unit-tests" className="group block">
          <div className="bg-white h-full p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>

            <div className="w-16 h-16 bg-indigo-100/80 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
              <FileEdit className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
              Unit Quizzes
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Draft targeted MCQ and distinct assessments directly linked to ongoing topics.
            </p>
            <div className="flex items-center text-indigo-600 font-bold text-sm bg-indigo-50 w-max px-4 py-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
              Open Module <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Create Mock Tests */}
        <Link to="create-mock-tests" className="group block">
          <div className="bg-white h-full p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-50/50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>

            <div className="w-16 h-16 bg-violet-100/80 text-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-violet-600 group-hover:text-white transition-colors duration-500">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">
              Mock Exams
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Publish comprehensive full-syllabus test environments simulating real test conditions.
            </p>
            <div className="flex items-center text-violet-600 font-bold text-sm bg-violet-50 w-max px-4 py-2 rounded-lg group-hover:bg-violet-100 transition-colors">
              Open Module <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
