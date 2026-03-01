import { API_URL } from '../config.js';
import axios from "axios";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, Video, MonitorPlay, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import toast from 'react-hot-toast';

export default function OnlineClassAdmin() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const res = await axios.get(`${API_URL}/api/online-classes`);
    setClasses(res.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSchedule = async () => {
    if (!subject || !date || !time || !meetingLink) {
      toast.error("Please fill all fields");
      return;
    }

    await axios.post(`${API_URL}/api/online-classes/add`, { subject, date, time, meetingLink });
    toast.success("Class Scheduled Successfully");
    handleReset();
    fetchClasses();
  };

  const handlePostpone = async (id) => {
    await axios.put(`${API_URL}/api/online-classes/postpone/${id}`);
    fetchClasses();
  };

  const handleReset = () => {
    setSubject("");
    setDate("");
    setTime("");
    setMeetingLink("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <MonitorPlay className="h-8 w-8 text-emerald-600" />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Class Scheduler</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">

        {/* Scheduling Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -z-10 text-emerald-100/50 flex justify-end"></div>

          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" /> Plan New Session
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Class Subject</label>
              <input
                value={subject}
                placeholder="Subject area"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <input
                    type="time"
                    value={time}
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Meeting URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <input
                  value={meetingLink}
                  placeholder="https://meet.google.com/..."
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                onClick={handleSchedule}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                Schedule Class
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Scheduled Timeline</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {classes.length === 0 && (
              <div className="sm:col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200 border-dashed text-slate-500">
                <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p>No classes are currently scheduled.</p>
              </div>
            )}

            {classes.map((cls) => {
              const isPostponed = cls.status === "Postponed";

              return (
                <div key={cls._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
                  {isPostponed && <div className="absolute inset-0 bg-red-50/10 pointer-events-none z-10"></div>}

                  <div className="flex justify-between items-start mb-4 relative z-20">
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${isPostponed ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {cls.status}
                      </span>
                      <h3 className={`font-bold text-lg line-clamp-1 ${isPostponed ? 'text-slate-500' : 'text-slate-900'}`}>
                        {cls.subject}
                      </h3>
                    </div>

                    {!isPostponed && (
                      <button
                        onClick={() => handlePostpone(cls._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                        title="Cancel/Postpone Class"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className={`space-y-2 mb-5 relative z-20 ${isPostponed ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {cls.date}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {cls.time}
                    </div>
                  </div>

                  {!isPostponed && (
                    <div className="pt-4 border-t border-slate-100 relative z-20">
                      <div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-50 px-3 py-2 rounded-lg truncate">
                        <LinkIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{cls.meetingLink}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}