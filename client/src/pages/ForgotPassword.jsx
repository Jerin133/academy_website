import { API_URL } from '../config.js';
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e?.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });

      toast.success("Verification code sent to your email!");
      setSuccessMsg(res.data.message || "Verification code sent to your Gmail! Check your inbox.");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1800);

    } catch (err) {
      const serverErr = err.response?.data;
      const msg = typeof serverErr === 'string' ? serverErr : "Failed to send reset email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md p-6 relative z-10">
        <button
          onClick={() => navigate("/login")}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </button>

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-3xl p-8 border border-white">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Forgot Password?</h2>
            <p className="text-slate-500 text-sm">Enter your registered email address to receive a 6-digit verification code in your inbox.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-700 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="student@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Verification Email"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm">
              Already have your verification code?{" "}
              <Link to="/reset-password" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Enter Code & Reset
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
