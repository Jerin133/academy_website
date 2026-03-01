import { API_URL } from '../config.js';
import { Link } from "react-router-dom";
import { BookOpen, Target, PlayCircle, Star, Video, Award } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Student");

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
        console.error("Failed to fetch dashboard user data:", error);
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
            Ready to continue your journey? Dive right into learning!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium text-sm border border-blue-100 shadow-sm">
          <span>Keep up the great work!</span>
        </div>
      </div>

      {/* Featured Banner Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 border border-white/20"></div>
        <div className="relative z-10 text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-white/10">
            New Masterclass added
          </div>
          <h3 className="text-4xl font-extrabold mb-4 leading-tight">Mastering Advanced <br/> Chemistry 2026</h3>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed font-medium">
            Our newest comprehensive course module is live! Explore deep-dive video lessons, interactive problem solving, and completely new mock exams.
          </p>
          <Link
            to="/dashboard/lessons"
            className="bg-white text-blue-700 hover:bg-slate-50 w-max px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl shadow-md"
          >
            <PlayCircle className="h-5 w-5" /> Start Watching Now
          </Link>
        </div>
      </div>

      {/* Main Action Cards (2 Columns now to replace the 3rd Track Progress card) */}
      <div className="grid sm:grid-cols-2 gap-8">
        {/* Lessons Card */}
        <Link to="/dashboard/lessons" className="group block h-full">
          <div className="bg-white h-full shadow-sm hover:shadow-2xl transition-all duration-500 p-8 rounded-3xl border border-slate-100 relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>

            <div className="w-16 h-16 bg-blue-100/80 rounded-2xl flex items-center justify-center mb-8 text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              Continue Learning
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Dive back into your subject-wise video lessons. Everything you left off is saved securely.
            </p>
            <div className="flex items-center text-blue-600 font-bold text-sm bg-blue-50 w-max px-4 py-2 rounded-lg group-hover:bg-blue-100 transition-colors">
              Start Lesson Module
            </div>
          </div>
        </Link>

        {/* Mock Tests Card */}
        <Link to="/dashboard/mock-tests" className="group block h-full">
          <div className="bg-white h-full shadow-sm hover:shadow-2xl transition-all duration-500 p-8 rounded-3xl border border-slate-100 relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>

            <div className="w-16 h-16 bg-indigo-100/80 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
              Take Mock Tests
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
              Ready to evaluate your preparation? Access full-syllabus mock examinations right here.
            </p>
            <div className="flex items-center text-indigo-600 font-bold text-sm bg-indigo-50 w-max px-4 py-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
              Attempt Latest Test
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Access to Online classes */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-slate-300 transition-colors">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
            <Video className="h-8 w-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Upcoming Live Classes</h4>
            <p className="text-slate-500 font-medium mt-1">Join the next interactive session scheduled by your instructors.</p>
          </div>
        </div>
        <Link to="/dashboard/online-classes" className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-center flex justify-center items-center gap-2">
          <PlayCircle className="h-5 w-5" /> Join Live
        </Link>
      </div>
    </div>
  );
}
