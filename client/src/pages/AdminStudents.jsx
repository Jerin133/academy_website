import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Users, Search, Mail, Calendar, ShieldAlert, CheckCircle, XCircle, Clock, ShieldCheck, UserCheck, UserX } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // "all", "pending", "approved"
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/auth/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (studentId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      setActionLoadingId(studentId);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/auth/students/${studentId}/status`,
        { isApproved: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudents(prev =>
        prev.map(st => (st._id === studentId ? { ...st, isApproved: res.data.isApproved } : st))
      );

      if (newStatus) {
        toast.success("Student approved! They can now access the portal.");
      } else {
        toast.success("Student access revoked.");
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Failed to update student approval status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = students.filter(s => !s.isApproved).length;
  const approvedCount = students.filter(s => s.isApproved).length;

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterTab === "pending") return !student.isApproved;
    if (filterTab === "approved") return student.isApproved;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Student Approvals & Management</h1>
          <p className="text-slate-500 font-medium text-sm">Review registered students, grant portal permissions, and manage student access.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Total Registered</p>
              <p className="text-xl font-black text-indigo-700 leading-none">{students.length}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Pending Approval</p>
              <p className="text-xl font-black text-amber-700 leading-none">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Approved</p>
              <p className="text-xl font-black text-emerald-700 leading-none">{approvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Controls Bar: Search + Tabs */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterTab === "all"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilterTab("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterTab === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterTab("approved")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterTab === "approved"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4">Student Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Portal Status</th>
                <th className="px-6 py-4 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading students data...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ShieldAlert className="w-12 h-12 mb-4 text-slate-300" />
                      <p className="text-lg font-semibold text-slate-600">No students found</p>
                      <p className="text-sm mt-1">Try adjusting your filter or search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(student.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Approved & Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Approval
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.isApproved ? (
                        <button
                          onClick={() => handleToggleApproval(student._id, true)}
                          disabled={actionLoadingId === student._id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                        >
                          {actionLoadingId === student._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserX className="w-4 h-4" />
                          )}
                          Revoke Access
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleApproval(student._id, false)}
                          disabled={actionLoadingId === student._id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                        >
                          {actionLoadingId === student._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          Approve Student
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
