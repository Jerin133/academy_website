import { API_URL } from '../config.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Download, FileText, FileDown, FolderOpen } from "lucide-react";

export default function SubjectMaterials() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/materials/${subject}`)
      .then(res => setMaterials(res.data));
  }, [subject]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/dashboard/lessons/${subject}`)}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Topics
      </button>

      <div className="flex items-center gap-3 mb-8">
        <FolderOpen className="h-8 w-8 text-indigo-600" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {subject} <span className="text-slate-500 font-medium">Materials</span>
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

        {materials.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-900 mb-1">No materials available</p>
            <p>Study materials for {subject} haven't been uploaded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {materials.map((mat) => (
              <div key={mat._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{mat.fileName}</h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <FileDown className="h-3 w-3" /> Available for download
                    </p>
                  </div>
                </div>

                <a
                  href={`${API_URL}/${mat.filePath}`}
                  download
                  className="shrink-0 flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
                >
                  <Download className="h-5 w-5" /> Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}