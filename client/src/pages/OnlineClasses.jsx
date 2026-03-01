import { API_URL } from '../config.js';
import axios from "axios";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, Video, MonitorPlay } from "lucide-react";

export default function OnlineClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/online-classes`)
      .then(res => setClasses(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <MonitorPlay className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Online Classes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const isPostponed = cls.status === "Postponed";
          const isScheduled = cls.status === "Scheduled";

          return (
            <div key={cls._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col">
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                {isPostponed ? (
                  <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    {cls.status}
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    {cls.status}
                  </span>
                )}
              </div>

              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 border border-blue-100">
                <Video className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-1 pr-16 text-ellipsis">
                {cls.subject}
              </h3>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <CalendarDays className="h-5 w-5 text-slate-400" />
                  {cls.date}
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <Clock className="h-5 w-5 text-slate-400" />
                  {cls.time}
                </div>
              </div>

              {isScheduled ? (
                <a
                  href={cls.meetingLink?.startsWith('http') ? cls.meetingLink : `https://${cls.meetingLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20"
                >
                  <Video className="h-4 w-4" /> Join Class
                </a>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 px-4 py-3 rounded-xl font-semibold cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          );
        })}

        {classes.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center text-slate-500">
              <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No scheduled classes</h3>
              <p>Your instructors will schedule upcoming live classes here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}