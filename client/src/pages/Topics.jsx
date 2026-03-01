import { API_URL } from '../../config.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Play, FileText, LayoutList } from "lucide-react";

export default function Topics() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/lessons`)
      .then(res => {
        const filtered = res.data.filter(
          lesson => lesson.subject === subject
        );
        setLessons(filtered);
      });
  }, [subject]);

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/dashboard/lessons")}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Subjects
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutList className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {subject}
            </h2>
          </div>
          <p className="text-slate-500">
            {lessons.length} topics available in this subject.
          </p>
        </div>

        <button
          onClick={() => navigate(`/dashboard/materials/${subject}`)}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 py-2.5 rounded-xl font-semibold transition-colors border border-indigo-200"
        >
          <FileText className="h-5 w-5" />
          Subject Materials
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            onClick={() => navigate(`/dashboard/lessons/${lesson.subject}/${lesson.topicNumber}`)}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex gap-4"
          >
            <div className="shrink-0">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Play className="h-5 w-5 ml-0.5" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                Topic {lesson.topicNumber}
              </span>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {lesson.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
          <LayoutList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No topics available</h3>
          <p className="text-slate-500">Topics for {subject} haven't been added yet.</p>
        </div>
      )}
    </div>
  );
}