import { API_URL } from '../config.js';
import { useState } from "react";
import axios from "axios";
import { Plus, X, ListPlus, Save, RotateCcw, HelpCircle, FileEdit, CheckCircle2, Clock, Trash2, Edit } from "lucide-react";
import { useEffect } from "react";
import toast from 'react-hot-toast';

export default function CreateUnitTests() {
  const [subject, setSubject] = useState("");
  const [topicNumber, setTopicNumber] = useState("");
  const [tests, setTests] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/unit-tests`);
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching unit tests", err);
    }
  };

  const deleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit test?")) return;
    try {
      await axios.delete(`${API_URL}/api/unit-tests/delete/${id}`);
      toast.success("Test deleted successfully!");
      fetchTests();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting test");
    }
  };

  const editTest = (test) => {
    setEditingId(test._id);
    setSubject(test.subject);
    setTopicNumber(test.topicNumber);
    setQuestions(test.questions || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [questions, setQuestions] = useState([
    {
      questionType: "MCQ",
      questionText: "",
      options: [""],
      answers: []
    }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionType: "MCQ",
        questionText: "",
        options: [""],
        answers: []
      }
    ]);
  };

  const addOption = (index) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  const addAnswer = (index) => {
    const updated = [...questions];
    updated[index].answers.push("");
    setQuestions(updated);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleTypeChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionType = value;
    updated[index].answers = [];
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, ansIndex, value) => {
    const updated = [...questions];
    if (updated[qIndex].questionType === "MCQ") {
      updated[qIndex].answers = [value];
    } else {
      updated[qIndex].answers[ansIndex] = value;
    }
    setQuestions(updated);
  };

  const handleUpload = async () => {
    if (!subject || !topicNumber || questions.some(q => !q.questionText || q.options.some(o => !o) || q.answers.length === 0)) {
      toast.error("Please ensure all fields, options, and answers are filled.");
      return;
    }

    await axios.post(`${API_URL}/api/unit-tests/add`, {
      subject,
      topicNumber: Number(topicNumber),
      questions
    });

    toast.success("Unit Test Uploaded Successfully!");
    handleReset();
  };

  const handleReset = () => {
    setSubject("");
    setTopicNumber("");
    setQuestions([{ questionType: "MCQ", questionText: "", options: [""], answers: [] }]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length === 1) return;
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <FileEdit className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{editingId ? "Edit Unit Test" : "Create Unit Test"}</h1>
      </div>

      {/* Basic Info Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <LayoutListIcon /> Link to Lesson Topic
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject Name</label>
            <input
              value={subject}
              placeholder="e.g. History"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic Number</label>
            <input
              type="number"
              value={topicNumber}
              placeholder="e.g. 1"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              onChange={(e) => setTopicNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 relative">

            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(qIndex)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                {qIndex + 1}
              </div>
              <h2 className="font-semibold text-xl text-slate-900">
                Question Details
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Type</label>
                <select
                  value={question.questionType}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                  onChange={(e) => handleTypeChange(qIndex, e.target.value)}
                >
                  <option value="MCQ">MCQ (Single Correct Option)</option>
                  <option value="MSQ">MSQ (Multiple Correct Options)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Text</label>
                <textarea
                  value={question.questionText}
                  placeholder="Type your question here..."
                  rows="2"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-3">Answer Options</label>

                <div className="space-y-3 mb-4">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <div className="shrink-0 w-8 text-center text-slate-400 font-medium">{String.fromCharCode(65 + optIndex)}</div>
                      <input
                        value={option}
                        placeholder={`Option text...`}
                        className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                      />
                      {question.options.length > 1 && (
                        <button
                          onClick={() => removeOption(qIndex, optIndex)}
                          className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors border border-slate-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addOption(qIndex)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Another Option
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 bg-indigo-50/50 -mx-6 sm:-mx-8 px-6 sm:px-8 pb-2 rounded-b-3xl">
                <label className="text-sm font-bold text-indigo-900 mb-3 pt-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Setup Correct Answer(s)
                </label>

                {question.questionType === "MCQ" && (
                  <select
                    value={question.answers[0] || ""}
                    className="w-full sm:w-1/2 p-3 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-indigo-900 font-medium"
                    onChange={(e) => handleAnswerChange(qIndex, 0, e.target.value)}
                  >
                    <option value="" disabled>Select the correct answer</option>
                    {question.options.map((opt, index) => (
                      opt && <option key={index} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {question.questionType === "MSQ" && (
                  <div className="space-y-3">
                    {question.answers.map((ans, ansIndex) => (
                      <div key={ansIndex} className="flex gap-2">
                        <select
                          value={ans}
                          className="flex-1 sm:w-1/2 p-3 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-indigo-900 font-medium"
                          onChange={(e) => handleAnswerChange(qIndex, ansIndex, e.target.value)}
                        >
                          <option value="" disabled>Select correct answer {ansIndex + 1}</option>
                          {question.options.map((opt, index) => (
                            opt && <option key={index} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button
                      onClick={() => addAnswer(qIndex)}
                      className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add Answer Key
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-bold transition-all w-full justify-center"
        >
          <ListPlus className="h-5 w-5" /> Add Another Question
        </button>
      </div>

      <br/>

      {/* Floating Action Bar */}
      <div className="sticky bottom-6 mt-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-2xl border border-slate-200 z-10 w-full max-w-4xl">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Reset Form
        </button>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 hover:-translate-y-0.5"
        >
          <Save className="h-5 w-5" /> Save Unit Test
        </button>
      </div>

    </div>
  );
}

function LayoutListIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
}