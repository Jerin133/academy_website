import { API_URL } from '../config.js';
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { FolderOpen, UploadCloud, FileText, Trash2, Download } from "lucide-react";
import toast from 'react-hot-toast';

export default function StudyMaterials() {
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMaterials = async () => {
    const res = await axios.get(`${API_URL}/api/materials/all`);
    setMaterials(res.data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleUpload = async () => {
    if (!subject || !file) {
      toast.error("Please check subject and file fields.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("file", file);

    try {
      await axios.post(
        `${API_URL}/api/materials/upload`,
        formData
      );

      toast.success("Material uploaded successfully!");
      setSubject("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMaterials();

    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    await axios.delete(`${API_URL}/api/materials/${id}`);
    fetchMaterials();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FolderOpen className="h-8 w-8 text-violet-600" />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Materials</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">

        {/* Upload Panel */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-bl-full -z-10"></div>

          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-violet-600" /> Add New
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject Map</label>
              <input
                value={subject}
                placeholder="Subject Name"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Document File</label>

              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-slate-300 hover:border-violet-400 hover:bg-slate-50'} ${file ? 'bg-violet-50/50 border-violet-200' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); setFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 text-violet-500 mb-2" />
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Ready to upload</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-600">Click or drag file</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, etc.</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              className="w-full bg-violet-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-violet-700 shadow-md shadow-violet-600/20 transition-all mt-4"
            >
              Upload Document
            </button>
          </div>
        </div>

        {/* List Panel */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Database Index
            </h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {materials.length} Files
            </span>
          </div>

          <div className="p-0">
            {materials.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p>No materials have been uploaded globally.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {materials.map((mat) => (
                  <div
                    key={mat._id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{mat.fileName}</p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mt-1">
                          {mat.subject}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`${API_URL}/api/materials/download/${mat._id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(mat._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}