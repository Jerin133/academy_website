import { API_URL } from '../config.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, PlayCircle, ClipboardCheck, Clock } from "lucide-react";

export default function LessonView() {
  const { subject, topic } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [unitTest, setUnitTest] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/lessons`)
      .then(res => {
        const found = res.data.find(
          l => l.subject === subject &&
            l.topicNumber === Number(topic)
        );
        setLesson(found);
      });

    axios
      .get(`${API_URL}/api/unit-tests/${subject}/${topic}`)
      .then(res => setUnitTest(res.data))
      .catch(() => setUnitTest(null));

  }, [subject, topic]);

  const getEmbedUrl = (url) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!lesson) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/dashboard/lessons/${subject}`)}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to {subject} Topics
      </button>

      {/* Video Header container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

        {/* The Video embed */}
        <div className="w-full aspect-video bg-black relative group">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={getEmbedUrl(lesson.youtubeLink)}
            allowFullScreen
            title="Video Player"
          ></iframe>
        </div>

        {/* Video metadata */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Topic {lesson.topicNumber}
            </span>
            <span className="text-slate-500 flex items-center gap-1 text-sm font-medium">
              <PlayCircle className="h-4 w-4" /> Video Lesson
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-6">
            {lesson.title}
          </h2>

          {unitTest ? (
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-indigo-900 mb-1 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" /> Test Your Knowledge
                </h4>
                <p className="text-indigo-700/80 text-sm">
                  A unit test is available for this topic. Take the test to evaluate your understanding.
                </p>
              </div>
              <button
                onClick={() => navigate(`/dashboard/attempt-test/${subject}/${topic}`)}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
              >
                Attempt Unit Test
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-4 text-slate-500">
              <Clock className="h-6 w-6 text-slate-400 shrink-0" />
              <p className="text-sm">No unit test is currently available for this topic. Check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}