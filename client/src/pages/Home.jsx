import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  BookOpen, UserCheck, Award, ArrowRight, PlayCircle, Star,
  GraduationCap, Laptop, Target, CheckCircle2, MessageCircle,
  TrendingUp, Play, Zap, Shield, Globe, Users, ArrowUpRight, X,
  Mail, Phone, Sparkles
} from "lucide-react";

export default function Home() {
  const [showProfessorModal, setShowProfessorModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (e, name) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const scrollToProfessor = () => {
    const el = document.getElementById("professor-details-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setShowProfessorModal(true), 800);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 text-slate-800">
      <Navbar />

      {/* Header Extension Block: Flash News Ticker + Sub-Navbar */}
      <div className="w-full absolute top-16 left-0 right-0 z-40 flex flex-col">
        {/* 📢 Premium Flash News Ticker */}
        <div className="w-full bg-slate-50/95 backdrop-blur-md border-b border-slate-200/60 overflow-hidden flex items-center relative h-10 group shadow-sm">
          
          {/* Fixed "Updates" Badge on the left */}
          <div className="absolute left-0 z-20 h-full flex items-center px-4 sm:px-5 bg-gradient-to-r from-blue-700 to-blue-600 shadow-[4px_0_12px_-2px_rgba(37,99,235,0.4)]">
            <span className="flex items-center gap-1.5 text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase">
               <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" /> Updates
            </span>
            {/* Angled edge */}
            <div className="absolute right-[-14px] top-0 h-0 w-0 border-y-[20px] border-y-transparent border-l-[14px] border-l-blue-600"></div>
          </div>

          <div className="absolute left-[90px] sm:left-[110px] z-10 w-20 h-full bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>

          <div className="flex whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused] items-center text-[13px] font-medium pl-[110px] sm:pl-[140px]">
            {/* Ticker Content duplicated for seamless infinite scroll effect */}
            <div className="flex items-center gap-10 pr-10">
              <span className="flex items-center gap-2.5 text-slate-800"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm ring-1 ring-red-500/20">NEW</span> Advanced Organic Synthesis Masterclass enrolling now!</span>
              <span className="flex items-center gap-2.5 text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100"><Star className="w-3 h-3 text-blue-600 fill-blue-600" /></span> Join our upcoming live Q&A session with Dr. M SenthilKumar this Friday.</span>
              <span className="flex items-center gap-2.5 text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100"><CheckCircle2 className="w-3 h-3 text-emerald-600" /></span> Term 2 examination results have been published in the student portal.</span>
              <span className="flex items-center gap-2.5 text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100"><TrendingUp className="w-3 h-3 text-indigo-600" /></span> Early bird registration for the Summer Crash Course ends in <span className="font-bold text-indigo-600">3 days</span>.</span>
            </div>

            <div className="flex items-center gap-10 pr-10" aria-hidden="true">
              <span className="flex items-center gap-2.5 text-slate-800"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm ring-1 ring-red-500/20">NEW</span> Advanced Organic Synthesis Masterclass enrolling now!</span>
              <span className="flex items-center gap-2.5 text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100"><Star className="w-3 h-3 text-blue-600 fill-blue-600" /></span> Join our upcoming live Q&A session with Dr. M SenthilKumar this Friday.</span>
              <span className="flex items-center gap-2.5 text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100"><CheckCircle2 className="w-3 h-3 text-emerald-600" /></span> Term 2 examination results have been published in the student portal.</span>
              <span className="flex items-center gap-2.5 text-slate-700"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100"><TrendingUp className="w-3 h-3 text-indigo-600" /></span> Early bird registration for the Summer Crash Course ends in <span className="font-bold text-indigo-600">3 days</span>.</span>
            </div>
          </div>

          <div className="absolute right-0 z-10 w-24 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
        </div>

        {/* Transparent Sub-Navbar */}
        <div className="w-full bg-transparent border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center flex-[1_1_0%] items-center min-h-[3.5rem] py-2 gap-x-6 gap-y-2 sm:gap-x-12 flex-wrap text-center mx-auto w-full">
              <button
                className={`font-semibold text-sm transition-colors whitespace-nowrap ${activeDropdown ? "text-slate-600" : "text-blue-600"
                  }`}
              >
                Home
              </button>

              {/* Courses */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown("courses")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={(e) => toggleDropdown(e, "courses")}
                  className={`text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors py-2 whitespace-nowrap cursor-pointer ${activeDropdown === "courses" ? "text-blue-600" : ""}`}
                >
                  Courses
                </button>
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden ${activeDropdown === "courses" ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
                  <div className="py-2 flex flex-col">
                    <Link to="/register" className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors block">Organic Chemistry</Link>
                    <Link to="/register" className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors block">Inorganic Chemistry</Link>
                    <Link to="/register" className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors block">Physical Chemistry</Link>
                    <Link to="/register" className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors block">Analytical Chemistry</Link>
                  </div>
                </div>
              </div>

              {/* Classes */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown("classes")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={(e) => toggleDropdown(e, "classes")}
                  className={`text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors py-2 whitespace-nowrap cursor-pointer ${activeDropdown === "classes" ? "text-blue-600" : ""}`}
                >
                  Classes
                </button>
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[340px] max-w-[90vw] bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden ${activeDropdown === "classes" ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
                  <div className="py-2">
                    <a href="https://youtube.com/@dr_m_senthilkumar_chem_academy?si=etb4EQ5zbJE3gPhM" target="_blank" rel="noopener noreferrer" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors">
                      Dr. M Senthilkumar Chem Academy Youtube Channel
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Us */}
              <button
                onClick={scrollToProfessor}
                className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors py-2 whitespace-nowrap"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 Refined Professional Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Very subtle background pattern */}
        < div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" ></div >
        {/* Soft abstract blur */}
        < div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-blue-50/50 rounded-[100%] blur-3xl opacity-70 pointer-events-none" ></div >

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                Empowering the next generation of leaders
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-in slide-in-from-bottom-6 fade-in duration-700 delay-150">
                Elevate Your <br />
                <span className="text-blue-600">Learning Experience.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
                Discover a world-class educational platform combining comprehensive courses, rigorous mock assessments, and expert instruction designed for your success.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-500">
                <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group">
                  Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 group">
                  <PlayCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Continue Learning
                </Link>
              </div>
            </div>

            {/* Premium Image/Graphic */}
            <div className="lg:w-1/2 relative w-full max-w-lg mx-auto lg:max-w-none animate-in zoom-in-95 fade-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-3 scale-105 -z-10 transition-transform hover:rotate-6 duration-700"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                alt="Students collaborating"
                className="rounded-[2.5rem] shadow-2xl border-4 border-white object-cover w-full h-auto aspect-[4/3]"
              />

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce hover:pause" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Assured Success Rating</p>
                  <p className="text-xl font-bold text-slate-900 flex items-center gap-1">99% <Star className="w-4 h-4 fill-amber-400 text-amber-400" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* 🌟 Premium Excellence Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex items-center flex-col md:flex-row gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shrink-0 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-1 flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="w-4 h-4" /> Excellent Coaching
                </h3>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Crack any government exam in chemistry.</h2>
              </div>
            </div>
            <div className="shrink-0">
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-1 group">
                Begin Preparation <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ Core Competencies (Professional Features) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-2">Our Methodology</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Designed for rigorous academic excellence.</h3>
            </div>
            <Link to="/login" className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
              Explore Curriculum <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Foundational Learning</h3>
              <p className="text-slate-600 leading-relaxed font-normal">
                Structured video modules and comprehensive reading materials that establish a deep theoretical understanding of core concepts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Adaptive Assessments</h3>
              <p className="text-slate-600 leading-relaxed font-normal">
                Continuous evaluation through timed mock tests, automated scoring, and detailed analytical feedback on academic progression.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shadow-sm">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Collaborative Ecology</h3>
              <p className="text-slate-600 leading-relaxed font-normal">
                Engage in live interactive sessions and peer-reviewed assignments fostered within a supportive academic community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 Popular Exams Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
              <Target className="w-4 h-4" /> Focused Preparation
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Master the Most Popular Exams</h2>
            <p className="text-lg text-slate-600">Tailored curriculum and rigorous testing designed specifically for top-tier competitive examinations.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* TRB Exam Card */}
            <div className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <BookOpen className="w-8 h-8" />
                </div>
                <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wide uppercase">High Success Rate</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">TRB Chemistry</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">Comprehensive coaching covering the entire syllabus for Teachers Recruitment Board examinations. Mock tests and previous year question analysis.</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Complete Syllabus Coverage
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Exhaustive Study Material
                </div>
              </div>

              <Link to="/register" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 uppercase tracking-wide text-sm">
                Explore TRB Course <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* SET / NET Exam Card */}
            <div className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold tracking-wide uppercase">Expert Guidance</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">SET / NET Chemistry</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">Deep dive into advanced concepts essential for succeeding in State and National Eligibility Tests. Intensive problem-solving sessions.</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Advanced Problem Solving
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Dedicated Mentorship
                </div>
              </div>

              <Link to="/register" className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 uppercase tracking-wide text-sm">
                Explore SET/NET Course <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🎓 Elite Faculty / Testimonial Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col lg:flex-row">

            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                "The curriculum here bridges the gap between theoretical knowledge and practical application flawlessly."
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                Under the guidance of industry veterans, students gain unparalleled insights. The structured approach to the LMS ensures that every learner receives personalized attention and a clear path to mastery.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  <img src="/Professor.jpeg" alt="Dr.M.SenthilKumar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Dr.M.SENTHILKUMAR</h4>
                  <p className="text-sm text-slate-500 font-medium">Associate Professor and Head of the Department (Chemistry)</p>
                  <p className="text-sm text-slate-500 font-medium">GCE, Dharmapuri</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative bg-slate-100 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop"
                alt="Library"
                className="w-full h-full object-cover opacity-90 mix-blend-multiply"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 🚀 Professional Call to Action */}
      <section id="professor-details-section" className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Take the Next Step in Your Career</h2>
          <p className="text-xl text-slate-600 mb-10 font-normal">Join a network of professionals and academics. Enroll today to access our comprehensive learning suite.</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-slate-900/20 transition-all flex items-center gap-2">
              Create Your Account
            </Link>
            <button onClick={() => setShowProfessorModal(true)} className="px-8 py-4 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg transition-all">
              Professor Details
            </button>
          </div>
        </div>
      </section>

      {/* 🌐 Clean Footer */}
      <footer className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl overflow-hidden shadow-md border-2 border-white w-12 h-12 flex items-center justify-center shrink-0">
                  <img src="/new-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                    Dr. M. SenthilKumar's
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">
                    Chemistry Academy
                  </span>
                </div>
              </div>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                Dedicated to providing excellence in digital education and professional development through innovative technology.
              </p>
              <p className="text-slate-700 max-w-sm text-sm font-semibold mt-4">
                Founder: Muthaiya.Kalai
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold uppercase text-xs tracking-wider mb-4">Academics</h4>
              <ul className="space-y-3">
                <li><span className="text-slate-600 text-sm font-medium">Course Catalog</span></li>
                <li><span className="text-slate-600 text-sm font-medium">Assessment Portal</span></li>
                <li><span className="text-slate-600 text-sm font-medium">Digital Library</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold uppercase text-xs tracking-wider mb-4">Administration</h4>
              <ul className="space-y-3">
                <li><Link to="/admin-login" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors flex items-center gap-1">Faculty Portal <ArrowUpRight className="w-3 h-3" /></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Academic LMS Institution. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Globe className="w-5 h-5" /></span>
            </div>
          </div>
        </div>
      </footer>

      {/* 👨‍🏫 Professor Details Modal */}
      {
        showProfessorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col sm:flex-row animate-in zoom-in-95 duration-300">
              {/* Image side */}
              <div className="sm:w-2/5 relative h-64 sm:h-auto">
                <img
                  src="/Professor.jpeg"
                  alt="Dr. M. SenthilKumar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6 sm:hidden">
                  <h3 className="text-2xl font-bold text-white">Dr. M. SenthilKumar</h3>
                </div>
              </div>

              {/* Content side */}
              <div className="sm:w-3/5 p-8 relative flex flex-col justify-center">
                <button
                  onClick={() => setShowProfessorModal(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="hidden sm:block mb-4">
                  <h3 className="text-2xl font-extrabold text-slate-900">Dr.M.SENTHILKUMAR</h3>
                  <p className="text-blue-600 font-medium text-sm">Associate Professor and Head of the Department (Chemistry)</p>
                </div>

                <div className="space-y-4 text-slate-600">
                  <p className="text-sm leading-relaxed">
                    Dr. M. Senthilkumar is an accomplished and experienced educator with 18 years of dedicated teaching service. He secured an outstanding GATE score of 92.42 and successfully cleared the TRB examinations for Polytechnic (2006) and Engineering Colleges (2008), reflecting his strong academic foundation and subject expertise. In addition to his extensive teaching experience, he has published 15 research papers, showcasing his commitment to research and academic excellence. His combination of knowledge, experience, and research contributions makes him a highly respected mentor and guide for students.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                    <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Contact Information</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <a href="mailto:chemistrykumarmalli@gmail.com" className="hover:text-blue-600 transition-colors font-medium">chemistrykumarmalli@gmail.com</a>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <a href="tel:+919751778569" className="hover:text-green-600 transition-colors font-medium">+91 9751778569</a>
                      </li>
                    </ul>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider mt-6">Credentials & Publications</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">Associate Professor and Head of the Department (Chemistry) at GCE, Dharmapuri.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">M.Sc, M.Phil, Ph.D. in Chemistry.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block mb-1 font-medium text-slate-700">Author of 2 books:</span>
                        <ul className="list-disc list-outside text-slate-500 ml-4 space-y-1">
                          <li>Competetive inorganic chemistry</li>
                          <li>An easy approach to group theory in competetive examination</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
