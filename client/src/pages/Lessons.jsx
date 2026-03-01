import { API_URL } from '../../config.js';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookMarked, ArrowRight } from "lucide-react";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/lessons`)
      .then(res => setLessons(res.data));
  }, []);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.subject]) {
      acc[lesson.subject] = [];
    }
    acc[lesson.subject].push(lesson);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Subjects
        </h2>
        <p className="text-slate-500 mt-2">
          Select a subject to view its topics and video lessons.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(groupedLessons).map((subject, idx) => {
          // A simple color array to make cards look vibrant
          const colors = [
            "text-blue-600 bg-blue-50 border-blue-200",
            "text-indigo-600 bg-indigo-50 border-indigo-200",
            "text-violet-600 bg-violet-50 border-violet-200",
            "text-emerald-600 bg-emerald-50 border-emerald-200",
            "text-amber-600 bg-amber-50 border-amber-200"
          ];
          const colorClass = colors[idx % colors.length];

          return (
            <div
              key={subject}
              onClick={() => navigate(`/dashboard/lessons/${subject}`)}
              className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${colorClass}`}>
                <BookMarked className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {subject}
              </h3>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {groupedLessons[subject].length} Topics
                </span>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm font-semibold">
                  View <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(groupedLessons).length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
          <BookMarked className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No subjects found</h3>
          <p className="text-slate-500">Wait for your instructors to upload lessons.</p>
        </div>
      )}
    </div>
  );
}