import { API_URL } from '../../config.js';
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Save, FileEdit, Trash2, Edit, Target, Clock, AlertCircle, LayoutList, CheckCircle2 } from "lucide-react";
import toast from 'react-hot-toast';

export default function CreateMockTests() {
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [timeLimit, setTimeLimit] = useState(30);
    const [questions, setQuestions] = useState([]);
    const [tests, setTests] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tests`);
            setTests(res.data);
        } catch (err) {
            console.error("Error fetching tests", err);
        }
    };

    const deleteTest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this mock test?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/tests/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTests();
        } catch (err) {
            console.error(err);
            toast.error("Error deleting test");
        }
    };

    const editTest = (test) => {
        setEditingId(test._id);
        setSubject(test.subject);
        setTitle(test.title);
        setTimeLimit(test.timeLimit || 30);
        setQuestions(test.questions || []);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                type: "mcq",
                options: ["", "", "", ""],
                correctAnswers: []
            }
        ]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        if (field === "type") {
            updated[index].correctAnswers = [];
        }
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleCorrectAnswer = (qIndex, optionIndex) => {
        const updated = [...questions];
        const q = updated[qIndex];

        if (q.type === "mcq") {
            q.correctAnswers = [optionIndex];
        } else {
            if (q.correctAnswers.includes(optionIndex)) {
                q.correctAnswers = q.correctAnswers.filter(i => i !== optionIndex);
            } else {
                q.correctAnswers.push(optionIndex);
            }
        }

        setQuestions(updated);
    };

    const removeQuestion = (index) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };

    const removeOption = (qIndex, optIndex) => {
        const updated = [...questions];
        if (updated[qIndex].options.length > 2) {
            updated[qIndex].options.splice(optIndex, 1);
            const correctAnswers = updated[qIndex].correctAnswers;
            updated[qIndex].correctAnswers = correctAnswers.map(ans => ans > optIndex ? ans - 1 : ans).filter(ans => ans !== optIndex);
            setQuestions(updated);
        }
    };

    const addOption = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push("");
        setQuestions(updated);
    }

    const submitTest = async () => {
        if (!subject || !title || questions.length === 0 || questions.some(q => !q.question || q.options.some(o => !o) || q.correctAnswers.length === 0)) {
            toast.error("Please fill in all subject, title, question texts, options, and select at least one correct answer per question.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/tests/update/${editingId}`,
                    { subject, title, timeLimit, questions },
                    config
                );
                toast.success("Test Updated Successfully!");
            } else {
                await axios.post(
                    `${API_URL}/api/tests/add`,
                    { subject, title, timeLimit, questions },
                    config
                );
                toast.success("Test Created Successfully!");
            }

            setSubject("");
            setTitle("");
            setTimeLimit(30);
            setQuestions([]);
            setEditingId(null);
            fetchTests();
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 400) {
                localStorage.removeItem("token");
                window.location.href = "/admin-login";
            }
            toast.error("Error creating test");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Target className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Mock Tests</h1>
            </div>

            {/* Editor Panel */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileEdit className="h-5 w-5 text-indigo-500" /> {editingId ? "Edit Mock Test" : "Create New Mock Test"}
                    </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><LayoutList className="w-4 h-4 text-slate-400" /> Subject Name</label>
                        <input
                            value={subject}
                            placeholder="e.g. History"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><Target className="w-4 h-4 text-slate-400" /> Test Title</label>
                        <input
                            value={title}
                            placeholder="e.g. Midterm Practice 1"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Time Limit (Minutes)</label>
                    <input
                        type="number"
                        value={timeLimit}
                        placeholder="e.g. 30"
                        className="w-full sm:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">Questions ({questions.length})</h3>
                    <button
                        onClick={addQuestion}
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5 border border-indigo-100"
                    >
                        <Plus className="h-4 w-4" /> Add Question
                    </button>
                </div>

                {questions.length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                        <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No questions defined yet.</p>
                        <p className="text-slate-400 text-sm mt-1">Add a question to start building your mock test.</p>
                    </div>
                )}

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 relative group transition-all">
                        <button
                            onClick={() => removeQuestion(qIndex)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Remove Question"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-100/80 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200">
                                Q{qIndex + 1}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Type</label>
                                <select
                                    value={q.type}
                                    onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                                >
                                    <option value="mcq">MCQ (Single Choice)</option>
                                    <option value="msq">MSQ (Multiple Choice)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Text</label>
                                <textarea
                                    placeholder="Type the question..."
                                    value={q.question}
                                    rows={2}
                                    onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
                                    <span>Options & Correct Answers</span>
                                    <span className="text-xs font-normal text-slate-500">
                                        {q.type === 'mcq' ? 'Select ONE radio button' : 'Select ONE OR MORE checkboxes'}
                                    </span>
                                </label>

                                <div className="space-y-2">
                                    {q.options.map((opt, oIndex) => {
                                        const isCorrect = q.correctAnswers.includes(oIndex);
                                        return (
                                            <div key={oIndex} className={`flex items-center gap-3 p-2 rounded-lg transition-colors border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200/50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type={q.type === "mcq" ? "radio" : "checkbox"}
                                                        checked={isCorrect}
                                                        onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                                                        className={`w-5 h-5 cursor-pointer ${q.type === "mcq" ? "accent-emerald-500" : "accent-emerald-500 rounded"}`}
                                                        name={`q-${qIndex}-correct`}
                                                    />
                                                </div>
                                                <div className="flex-1 flex gap-2">
                                                    <div className="shrink-0 w-8 text-center text-slate-400 font-medium py-2.5 bg-slate-100/50 rounded-md border border-slate-100 text-sm">{String.fromCharCode(65 + oIndex)}</div>
                                                    <input
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        className="flex-1 p-2.5 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded-md transition-all placeholder:text-slate-300 text-slate-700"
                                                        placeholder={`Option ${oIndex + 1} text...`}
                                                    />
                                                </div>
                                                {q.options.length > 2 && (
                                                    <button
                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Remove Option"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                                <button
                                    onClick={() => addOption(qIndex)}
                                    className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 rounded-lg hover:bg-indigo-100 transition-colors w-full justify-center border border-indigo-100 border-dashed"
                                >
                                    <Plus className="h-4 w-4" /> Add Option
                                </button>
                                {q.correctAnswers.length === 0 && (
                                    <p className="text-amber-600 text-sm mt-3 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100/50">
                                        <AlertCircle className="w-4 h-4" /> Please select at least one correct answer.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Floating Action Bar */}
                <div className="sticky bottom-6 mt-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-2xl border border-slate-200 z-10 w-full max-w-4xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={addQuestion}
                            className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl font-medium transition-colors border border-indigo-100"
                        >
                            <Plus className="h-4 w-4" /> Add Question
                        </button>
                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setSubject("");
                                    setTitle("");
                                    setTimeLimit(30);
                                    setQuestions([]);
                                }}
                                className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-4 py-2.5 rounded-xl font-medium transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <button
                        onClick={submitTest}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5"
                    >
                        <Save className="h-5 w-5" /> {editingId ? "Update Test" : "Save Mock Test"}
                    </button>
                </div>
            </div>

            <hr className="my-10 border-slate-200" />

            {/* Existing Tests List */}
            <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                    <LayoutList className="h-6 w-6 text-indigo-500" /> Existing Mock Tests
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {tests.length === 0 && (
                        <div className="col-span-full bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center">
                            <p className="text-slate-500 font-medium">No mock tests have been created yet.</p>
                        </div>
                    )}
                    {tests.map((test) => (
                        <div key={test._id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>

                            <h4 className="font-bold text-xl text-slate-900 mb-2 truncate pr-16">{test.title}</h4>

                            <div className="flex flex-col gap-1.5 mb-5">
                                <p className="text-slate-600 text-sm font-medium flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs tracking-wider uppercase">{test.subject}</span>
                                </p>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> {test.timeLimit || 30} Minutes
                                </p>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400" /> {test.questions?.length || 0} Questions
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => editTest(test)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => deleteTest(test._id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
