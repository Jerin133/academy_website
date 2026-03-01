import { API_URL } from '../config.js';
import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Target, Clock, AlertCircle, Play, CheckCircle2, History, X, ChevronLeft, CalendarClock, ShieldAlert, Award } from "lucide-react";

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [history, setHistory] = useState([]);
  const [showGraphId, setShowGraphId] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/tests/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  // 🔹 Fetch all tests & history
  useEffect(() => {
    axios.get(`${API_URL}/api/tests`)
      .then(res => setTests(res.data));
    fetchHistory();
  }, []);

  // 🔹 Start test
  const startTest = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/tests/single/${id}`);
    setSelectedTest(res.data);
    setAnswers([]);
    setResult(null);
    setTimeLeft((res.data.timeLimit || 30) * 60);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Handle answer selection
  const handleAnswer = (qIndex, optionIndex, type) => {
    const updated = [...answers];
    const current = updated[qIndex] || [];

    if (type === "mcq") {
      updated[qIndex] = [optionIndex];
    } else {
      if (current.includes(optionIndex)) {
        updated[qIndex] = current.filter(i => i !== optionIndex);
      } else {
        updated[qIndex] = [...current, optionIndex];
      }
    }

    setAnswers(updated);
  };

  // 🔹 Submit test
  const submitTest = async () => {
    if (result) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/tests/submit`,
        {
          testId: selectedTest._id,
          answers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      setTimeLeft(null);
      fetchHistory(); // refresh history after submission
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Timer Countdown
  useEffect(() => {
    let timer;
    if (selectedTest && !result && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !result) {
      submitTest();
      toast.error("Time is up! Test auto-submitted.");
    }
    return () => clearInterval(timer);
  }, [timeLeft, selectedTest, result]);

  // 🔹 Anti-cheat Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && selectedTest && !result) {
        submitTest();
        toast.error("Test auto-submitted due to tab switch (Anti-Cheat).");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedTest, result, answers]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const calculateGrade = (score, total) => {
    const percent = (score / total) * 100;
    if (percent >= 90) return { text: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (percent >= 75) return { text: "Good", color: "text-blue-600 bg-blue-50 border-blue-200" };
    if (percent >= 50) return { text: "Average", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { text: "Needs Improvement", color: "text-red-600 bg-red-50 border-red-200" };
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header Section (Hide during test) */}
      {!selectedTest && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              Mock Tests Dashboard
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Test your knowledge and track your performance under timed conditions.</p>
          </div>
        </div>
      )}

      {/* 🔹 Show test list */}
      {!selectedTest && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.length === 0 && (
            <div className="col-span-full bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
              <CalendarClock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-bold text-xl mb-1">No Tests Available</p>
              <p className="text-slate-500 font-medium">Check back later or contact your instructor.</p>
            </div>
          )}
          {tests.map(test => (
            <div
              key={test._id}
              onClick={() => startTest(test._id)}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-100 text-blue-700 font-bold tracking-wider text-xs px-3 py-1 rounded-full uppercase truncate max-w-[150px]">
                  {test.subject}
                </span>
                <div className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  {test.timeLimit || 30}m
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors flex-1">{test.title}</h3>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-2 mr-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">Q</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  {test.questions?.length || 0} Questions
                </p>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-600/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    startTest(test._id);
                  }}
                >
                  <Play className="w-4 h-4 fill-current" /> Start Test
                </button>
                {history.some(h => (h.testId?._id || h.testId) === test._id) && (
                  <button
                    className="flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center border border-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGraphId(test._id);
                    }}
                    title="View Performance History"
                  >
                    <History className="w-5 h-5 text-indigo-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Performance Graph Modal */}
      {showGraphId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200">
            <button
              onClick={() => setShowGraphId(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
              <History className="text-indigo-500 w-7 h-7" /> Performance Evolution
            </h3>
            <p className="text-slate-500 font-medium mb-8 pb-4 border-b border-slate-100">Review your past scores for this test module.</p>

            <div className="h-72 w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history.filter(h => (h.testId?._id || h.testId) === showGraphId).map((h, i) => ({ attempt: `Attempt ${i + 1}`, score: h.score, total: h.total, percent: Math.round((h.score / h.total) * 100) }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="attempt" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dx={-10} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="percent" name="Score (%)" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {history.filter(h => (h.testId?._id || h.testId) === showGraphId).length < 2 && (
              <p className="mt-4 text-center text-sm text-slate-400 font-medium bg-slate-50 p-2 rounded-lg">Complete the test multiple times to see a trend line.</p>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Show Active Test */}
      {selectedTest && !result && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
                  setSelectedTest(null)
                }
              }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm animate-pulse">
              <ShieldAlert className="w-4 h-4" /> ANTI-CHEAT ACTIVE
            </div>
          </div>

          <div className="sticky top-4 bg-white/90 backdrop-blur-md p-5 shadow-lg shadow-slate-200/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center z-20 border border-slate-200 transition-all">
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1 block">{selectedTest.subject}</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{selectedTest.title}</h3>
            </div>
            <div className={`mt-4 sm:mt-0 flex items-center justify-center gap-2 font-mono px-5 py-3 rounded-xl font-bold text-xl border shadow-inner ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-900 text-white border-slate-800'}`}>
              <Clock className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-500' : 'text-slate-400'}`} />
              {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
            </div>
          </div>

          <div className="space-y-6 mt-8">
            {(selectedTest.questions || []).map((q, qIndex) => (
              <div key={qIndex} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                    {qIndex + 1}
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold text-lg text-slate-800 leading-relaxed">
                      {q.question}
                    </p>
                    <span className="text-xs font-bold text-slate-400 mt-2 block uppercase tracking-wider">
                      {q.type === 'mcq' ? 'Choose 1 option' : 'Choose multiple options'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pl-14">
                  {q.options.map((opt, oIndex) => {
                    const isSelected = (answers[qIndex] || []).includes(oIndex);
                    return (
                      <label
                        key={oIndex}
                        className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-sm shadow-blue-100' : 'border-slate-100 bg-white hover:border-blue-300 hover:bg-slate-50'}`}
                      >
                        <div className="mt-0.5 relative flex items-center justify-center">
                          <input
                            type={q.type === "mcq" ? "radio" : "checkbox"}
                            name={`q-${qIndex}`}
                            checked={isSelected}
                            onChange={() => handleAnswer(qIndex, oIndex, q.type)}
                            className={`w-5 h-5 cursor-pointer accent-blue-600 ${q.type === 'msq' ? 'rounded' : ''}`}
                          />
                        </div>
                        <span className={`text-base font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{opt}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 pb-20">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to submit your test?")) {
                  submitTest();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-extrabold text-lg transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Submit Mock Test <CheckCircle2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Show Result Analysis */}
      {result && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 text-center relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

            <div className="w-24 h-24 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-lg">
              <Award className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Test Completed!</h2>
            <p className="text-slate-500 font-medium mb-8">Here is a detailed analysis of your performance.</p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mb-10">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Final Score</span>
                <div className="text-6xl font-black text-slate-900">
                  {result.score} <span className="text-3xl text-slate-300 font-bold">/ {result.total}</span>
                </div>
              </div>

              <div className="hidden sm:block w-px h-20 bg-slate-200"></div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Grade</span>
                <div className={`px-6 py-2 rounded-2xl font-bold text-xl border-2 ${calculateGrade(result.score, result.total).color}`}>
                  {calculateGrade(result.score, result.total).text}
                </div>
                <div className="text-sm font-bold text-slate-400 mt-2">
                  {Math.round((result.score / result.total) * 100)}% Accuracy
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedTest(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-transform shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back to Dashboard
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 mt-12 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-indigo-500" /> Answer Review
          </h3>

          <div className="space-y-6 pb-12">
            {(selectedTest.questions || []).map((q, qIndex) => {
              // Determine if question was fully correct
              const userAns = answers[qIndex] || [];
              const correctAns = result.correctAnswers[qIndex];
              const isFullyCorrect = userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a));

              return (
                <div key={qIndex} className={`bg-white p-6 sm:p-8 rounded-3xl shadow-sm border-2 ${isFullyCorrect ? 'border-emerald-100 shadow-emerald-100' : 'border-red-100 shadow-red-100'}`}>
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 shrink-0 rounded-full font-bold flex items-center justify-center text-sm border-2 ${isFullyCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        Q{qIndex + 1}
                      </div>
                      <p className="font-semibold text-lg text-slate-800 leading-relaxed pt-1.5">
                        {q.question}
                      </p>
                    </div>
                    {isFullyCorrect ? (
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"><CheckCircle2 className="w-3.5 h-3.5" /> Correct</div>
                    ) : (
                      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"><X className="w-3.5 h-3.5" /> Incorrect</div>
                    )}
                  </div>

                  <div className="space-y-3 pl-14">
                    {q.options.map((opt, oIndex) => {
                      const isCorrect = result.correctAnswers[qIndex].includes(oIndex);
                      const isSelected = (answers[qIndex] || []).includes(oIndex);

                      let statusClass = "border-slate-100 text-slate-600 bg-slate-50";
                      let Icon = null;

                      if (isCorrect && isSelected) {
                        // selected and correct
                        statusClass = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm";
                        Icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                      } else if (isCorrect && !isSelected) {
                        // missed correct answer
                        statusClass = "border-amber-300 bg-amber-50 text-amber-900 border-dashed";
                        Icon = <CheckCircle2 className="w-5 h-5 text-amber-500" />;
                      } else if (!isCorrect && isSelected) {
                        // selected wrong answer
                        statusClass = "border-red-300 bg-red-50 text-red-900 opacity-70";
                        Icon = <X className="w-5 h-5 text-red-500" />;
                      }

                      return (
                        <div key={oIndex} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${statusClass}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-md font-bold text-sm bg-white/50 border border-black/5`}>
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span className="font-medium text-base">
                              {opt}
                            </span>
                          </div>
                          {Icon && <div className="shrink-0">{Icon}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
