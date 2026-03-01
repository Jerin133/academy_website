import { API_URL } from '../config.js';
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, Video, Image as ImageIcon, BookOpen, Layers, ArrowLeft, UploadCloud, Trash2 } from "lucide-react";
import toast from 'react-hot-toast';

export default function ManageLessons() {
  const [lessons, setLessons] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    topicNumber: "",
    title: "",
    youtubeLink: ""
  });

  const fetchLessons = async () => {
    const res = await axios.get(`${API_URL}/api/lessons`);
    setLessons(res.data);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.subject]) {
      acc[lesson.subject] = [];
    }
    acc[lesson.subject].push(lesson);
    return acc;
  }, {});

  const getEmbedUrl = (url) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.topicNumber || !formData.title || !formData.youtubeLink) {
      toast.error("Please fill all fields");
      return;
    }

    await axios.post(`${API_URL}/api/lessons/add`, {
      ...formData,
      topicNumber: Number(formData.topicNumber)
    });

    toast.success("Lesson Added Successfully!");
    setFormData({ subject: "", topicNumber: "", title: "", youtubeLink: "" });
    setShowForm(false);
    fetchLessons();
  };

  const handleDeleteLesson = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    
    try {
      await axios.delete(`${API_URL}/api/lessons/delete/${id}`);
      if (selectedLesson?._id === id) {
        setSelectedLesson(null);
      }
      fetchLessons();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lesson.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Lessons</h1>
        </div>

        {!showForm && !selectedLesson && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
          >
            <Plus className="h-5 w-5" /> Add New Lesson
          </button>
        )}
      </div>

      {/* Add Lesson Form Panel */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-10"></div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-blue-600" /> Upload Video Lesson
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject Category</label>
              <input
                value={formData.subject}
                placeholder="e.g. Mathematics"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic Number</label>
              <input
                value={formData.topicNumber}
                type="number"
                placeholder="e.g. 1"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, topicNumber: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Lesson Title</label>
              <input
                value={formData.title}
                placeholder="Enter a descriptive title for the lesson..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">YouTube Video Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Video className="h-5 w-5" />
                </div>
                <input
                  value={formData.youtubeLink}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              Publish Lesson
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[400px]">

          {/* VIEW 1: SUBJECT LIST */}
          {!selectedSubject && !selectedLesson && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Layers className="h-5 w-5 text-slate-500" /> Browse by Subject
              </h3>

              {Object.keys(groupedLessons).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No lessons have been created yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(groupedLessons).map((subject) => (
                    <div
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer hover:bg-blue-50"
                    >
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 mb-1 transition-colors">
                        {subject}
                      </h4>
                      <p className="text-slate-500 text-sm font-medium">
                        {groupedLessons[subject].length} Topics Uploaded
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: TOPIC LIST */}
          {selectedSubject && !selectedLesson && (
            <div className="animate-fade-in">
              <button
                onClick={() => setSelectedSubject(null)}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Subjects
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                {selectedSubject} Lessons
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedLessons[selectedSubject].map((lesson) => (
                  <div
                    key={lesson._id}
                    onClick={() => setSelectedLesson(lesson)}
                    className="group flex gap-4 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer hover:bg-indigo-50/50"
                  >
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                        Topic {lesson.topicNumber}
                      </span>
                      <p className="font-semibold text-slate-900 line-clamp-2 leading-tight">
                        {lesson.title}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteLesson(lesson._id, e)}
                      className="p-2 h-10 w-10 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent self-center z-10 relative"
                      title="Delete Lesson"
                    >
                      <Trash2 className="h-5 w-5 mx-auto" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: VIDEO PLAYBACK */}
          {selectedLesson && (
            <div className="animate-fade-in">
              <button
                onClick={() => setSelectedLesson(null)}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to {selectedSubject}
              </button>

              <div className="bg-slate-100 rounded-3xl overflow-hidden shadow-xl relative group border border-slate-200">
                <iframe
                  className="w-full aspect-video"
                  src={getEmbedUrl(selectedLesson.youtubeLink)}
                  allowFullScreen
                  title="Video Player"
                ></iframe>
                <div className="p-6 bg-white shrink-0">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                    Topic {selectedLesson.topicNumber}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedLesson.title}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}