import { API_URL } from '../../config.js';
import axios from "axios";
import { ArrowLeft, CheckCircle2, RotateCcw, Send, FileQuestion } from "lucide-react";
import toast from 'react-hot-toast';

export default function AttemptTest() {
  const { subject, topic } = useParams();
  const navigate = useNavigate();

  const [unitTest, setUnitTest] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/unit-tests/${subject}/${topic}`)
      .then(res => setUnitTest(res.data));
  }, [subject, topic]);

  const handleSubmitTest = () => {
    // 🔴 Validation: Check all questions answered
    for (let i = 0; i < unitTest.questions.length; i++) {
      const answer = studentAnswers[i];
      if (!answer || answer.length === 0) {
        toast.error(`Please answer Question ${i + 1} before submitting.`);
        return; // Stop submission
      }
    }

    let score = 0;
    unitTest.questions.forEach((q, index) => {
      const student = studentAnswers[index] || [];
      const correct = [...q.answers].sort().join(",");
      const given = [...student].sort().join(",");
      if (correct === given) {
        score++;
      }
    });

    setResult({
      score,
      total: unitTest.questions.length
    });
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setStudentAnswers({});
    setResult(null);
    setIsSubmitted(false);
  };

  if (!unitTest) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/dashboard/lessons/${subject}/${topic}`)}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Lesson
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-50 mb-3 inline-block">
              Unit Test
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {subject} <span className="text-indigo-200">/ Topic {topic}</span>
            </h2>
          </div>
          <div className="bg-white/10 rounded-xl px-5 py-3 flex items-center gap-3 backdrop-blur-sm border border-white/10">
            <FileQuestion className="h-6 w-6 text-indigo-200" />
            <div>
              <p className="text-sm text-indigo-200 font-medium">Questions</p>
              <p className="text-xl font-bold">{unitTest.questions.length}</p>
            </div>
          </div>
        </div>

        {/* Results Banner */}
        {result && (
          <div className="bg-emerald-50 border-b border-emerald-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
                {Math.round((result.score / result.total) * 100)}%
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Test Completed</h4>
                <p className="text-slate-600">
                  You scored <span className="font-semibold text-emerald-700">{result.score}</span> out of {result.total}.
                </p>
              </div>
            </div>
            {result.score === result.total && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-100 px-4 py-2 rounded-xl">
                <CheckCircle2 className="h-5 w-5" /> Perfect Score!
              </div>
            )}
          </div>
        )}

        {/* Questions Section */}
        <div className="p-6 sm:p-8 space-y-10">
          {unitTest.questions.map((q, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 leading-snug pt-1">
                  {q.questionText}
                </h4>
              </div>

              <div className="space-y-3 pl-12">
                {q.options.map((opt, i) => {
                  const isChecked = studentAnswers[index]?.includes(opt) || false;

                  // Answer highlighting logic after submission
                  let optionClass = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                  if (isChecked) optionClass = "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500";

                  if (isSubmitted) {
                    const isCorrectAnswer = q.answers.includes(opt);
                    if (isCorrectAnswer) {
                      optionClass = "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-500 text-emerald-900";
                    } else if (isChecked && !isCorrectAnswer) {
                      optionClass = "bg-red-50 border-red-200 ring-1 ring-red-500 text-red-900 opacity-60";
                    } else {
                      optionClass = "bg-slate-50 border-slate-200 opacity-60";
                    }
                  }

                  return (
                    <div key={i}>
                      {q.questionType === "MCQ" ? (
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${optionClass} ${isSubmitted ? 'cursor-default' : ''}`}>
                          <div className="relative flex items-center justify-center shrink-0">
                            <input
                              type="radio"
                              name={`q-${index}`}
                              value={opt}
                              disabled={isSubmitted}
                              className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-indigo-600 disabled:checked:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-1 transition-all"
                              checked={isChecked}
                              onChange={(e) => setStudentAnswers({ ...studentAnswers, [index]: [e.target.value] })}
                            />
                            <div className="absolute w-2.5 h-2.5 bg-indigo-600 rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                          </div>
                          <span className="ml-3 font-medium">{opt}</span>
                        </label>
                      ) : (
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${optionClass} ${isSubmitted ? 'cursor-default' : ''}`}>
                          <div className="relative flex items-center justify-center shrink-0">
                            <input
                              type="checkbox"
                              value={opt}
                              disabled={isSubmitted}
                              className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:border-indigo-600 checked:bg-indigo-600 disabled:checked:border-slate-400 disabled:checked:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-1 transition-all"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = studentAnswers[index] || [];
                                if (e.target.checked) setStudentAnswers({ ...studentAnswers, [index]: [...current, opt] });
                                else setStudentAnswers({ ...studentAnswers, [index]: current.filter(a => a !== opt) });
                              }}
                            />
                            <div className="absolute text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none flex items-center justify-center">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                          </div>
                          <span className="ml-3 font-medium">{opt}</span>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reveal Correct Answer Logic */}
              {isSubmitted && (
                <div className="mt-4 pl-12">
                  <div className="bg-slate-100 rounded-lg px-4 py-3 text-sm text-slate-700 flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold block mb-1">Correct Answer(s):</span>
                      {q.answers.join(", ")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Bottom Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 sm:px-8 flex items-center justify-between">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitTest}
              className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5"
            >
              Submit Answers <Send className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleRetake}
              className="ml-auto flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-800/20 hover:-translate-y-0.5"
            >
              <RotateCcw className="h-5 w-5" /> Retake Test
            </button>
          )}
        </div>

      </div>
    </div>
  );
}