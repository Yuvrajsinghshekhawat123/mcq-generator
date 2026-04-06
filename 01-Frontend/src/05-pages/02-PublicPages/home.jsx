import React, { useState } from "react";
import axios from "axios";

const QuizGenerator = () => {
  const [formData, setFormData] = useState({
    number: 5,
    subtopics: "",
    difficulty: "easy",
    question_type: "multiple", // 'single', 'multiple', 'truefalse'
    num_options: 4,
    text: "",
    file: null,
  });

  const [inputMethod, setInputMethod] = useState("text"); // 'text' or 'file'
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle number change with max limit of 10
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    let numValue = parseInt(value, 10) || 0;
    if (name === "number") {
      numValue = Math.min(10, Math.max(1, numValue));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  // Handle question type change - adjust num_options accordingly
  const handleQuestionTypeChange = (type) => {
    setFormData((prev) => {
      const newData = { ...prev, question_type: type };
      if (type === "truefalse") {
        newData.num_options = 2;
      }
      return newData;
    });
  };

  // File handling
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["application/pdf"];
      if (validTypes.includes(file.type)) {
        setFormData((prev) => ({ ...prev, file }));
      } else {
        alert("Please upload PDF (max 10MB)");
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ["application/pdf"];
      if (validTypes.includes(file.type) || file.name.endsWith(".txt")) {
        setFormData((prev) => ({ ...prev, file }));
      } else {
        alert("Please upload PDF (max 10MB)");
      }
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const clearText = () => {
    setFormData((prev) => ({ ...prev, text: "" }));
  };

  // Switch input method
  const switchInputMethod = (method) => {
    setInputMethod(method);
    if (method === "text") {
      setFormData((prev) => ({ ...prev, file: null }));
    } else {
      setFormData((prev) => ({ ...prev, text: "" }));
    }
  };

  // Check if content is available based on selected method
  const hasContent = () => {
    if (inputMethod === "text") {
      return formData.text && formData.text.trim().length > 0;
    } else {
      return formData.file !== null;
    }
  };

  // Transform backend response to frontend format

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasContent()) {
      if (inputMethod === "text") {
        alert("Please enter text content");
      } else {
        alert("Please upload a document");
      }
      return;
    }
    setIsGenerating(true);

    try {
      const fd = new FormData();

      fd.append("number", formData.number);
      fd.append("subtopics", formData.subtopics);
      fd.append("difficulty", formData.difficulty);
      fd.append("question_type", formData.question_type);
      fd.append("num_options", formData.num_options);
      fd.append("text", formData.text);

      if (formData.file) {
        fd.append("file", formData.file); // 🔥 THIS IS IMPORTANT
      }

      const res = await axios.post("http://18.207.249.208/generate", fd);
      console.log("Backend response:", res.data.data);

      if (res.data.success && res.data.data) {
        setGeneratedQuiz(res.data.data);
      } else {
        alert("Failed to generate quiz. Please try again.");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Error generating quiz. Please check your backend connection.", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            QuizForge
          </h1>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
            Generate smart quizzes from text or documents — up to 10 MCQs
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Input Method Toggle */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-3">
                  Choose Input Method
                </label>
                <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => switchInputMethod("text")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      inputMethod === "text"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-lg">📝</span>
                    <span>Enter Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchInputMethod("file")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      inputMethod === "file"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-lg">📄</span>
                    <span>Upload Resume/Doc</span>
                  </button>
                </div>
              </div>

              {/* Text Content Input */}
              {inputMethod === "text" && (
                <div className="mb-5">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Text Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Paste your content here... e.g., study notes, article, resume text, or any content you want to generate questions from"
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-y"
                  />
                  {formData.text && formData.text.length > 0 && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={clearText}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Clear text
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Enter any text content (notes, articles, resume, etc.) to
                    generate quiz questions
                  </p>
                </div>
              )}

              {/* File Upload Area */}
              {inputMethod === "file" && (
                <div className="mb-5">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    } ${formData.file ? "bg-green-50 border-green-400" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <input
                      type="file"
                      id="file-input"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {!formData.file ? (
                      <div>
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-gray-600">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF, DOCX, or TXT — up to 10 MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📎</span>
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                            {formData.file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="text-red-500 hover:text-red-700 font-bold text-xl ml-3 px-2"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Upload your resume, document, or any text file to generate
                    quiz questions
                  </p>
                </div>
              )}

              {/* Subtopics */}
              <div className="mb-5">
                <label className="block font-semibold text-gray-700 mb-2">
                  Subtopics / Focus Area
                  <span className="text-gray-400 text-sm font-normal ml-2">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  name="subtopics"
                  value={formData.subtopics}
                  onChange={handleInputChange}
                  placeholder="e.g., Machine Learning basics, React hooks, Python functions..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>

              {/* Quiz Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Number of Questions
                    <span className="text-gray-400 text-sm ml-1">(max 10)</span>
                  </label>
                  <input
                    type="number"
                    name="number"
                    value={formData.number}
                    onChange={handleNumberChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 10 questions per quiz
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            difficulty: level,
                          }))
                        }
                        className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${
                          formData.difficulty === level
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Question Type
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: "single", label: "Single Correct", icon: "○" },
                      {
                        value: "multiple",
                        label: "Multiple Correct",
                        icon: "☑",
                      },
                      { value: "truefalse", label: "True / False", icon: "✓✗" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleQuestionTypeChange(type.value)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 ${
                          formData.question_type === type.value
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Number of Options
                  </label>
                  <select
                    name="num_options"
                    value={formData.num_options}
                    onChange={handleInputChange}
                    disabled={formData.question_type === "truefalse"}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white ${
                      formData.question_type === "truefalse"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value={2}>2 options (A-B)</option>
                    <option value={3}>3 options (A-C)</option>
                    <option value={4}>4 options (A-D)</option>
                    <option value={5}>5 options (A-E)</option>
                  </select>
                  {formData.question_type === "truefalse" && (
                    <p className="text-xs text-gray-400 mt-1">
                      True/False always uses 2 options
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !hasContent()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Quiz...
                  </>
                ) : (
                  "🔥 Generate Quiz"
                )}
              </button>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                📋 Quiz Preview
              </h3>
              {generatedQuiz && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {generatedQuiz.length} questions
                </span>
              )}
            </div>

            {!generatedQuiz ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">
                  Your generated quiz will appear here
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[70vh]">
                {generatedQuiz.data.map((q, index) => {
                  const optionsArray = Object.values(q.options || {});
                  const optionKeys = Object.keys(q.options || {});

                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      {/* Question */}
                      <div className="font-semibold text-gray-800 mb-3 whitespace-pre-wrap">
                        {q.question}
                      </div>

                      {/* Options */}
                      <div className="space-y-2 ml-4 mb-3">
                        {optionsArray.map((opt, i) => {
                          const key = optionKeys[i];

                          const isCorrect = false;

                          return (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-gray-600 text-sm"
                            >
                              <span
                                className={`font-medium min-w-[24px] ${isCorrect ? "text-green-600 font-bold" : ""}`}
                              >
                                {key}.
                              </span>
                              <span
                                className={
                                  isCorrect ? "text-green-700 font-medium" : ""
                                }
                              >
                                {opt}
                              </span>
                              {isCorrect && (
                                <span className="text-green-500 text-xs ml-1">
                                  ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Multiple answer hint */}
                      {Array.isArray(q.answer) && (
                        <div className="text-xs text-purple-600 mb-2">
                          💡 Select all that apply
                        </div>
                      )}

                      {/* Answer */}
                      <details className="mt-2 group">
                        <summary className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium">
                          Show answer
                        </summary>
                        <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                          <p className="text-sm font-semibold text-gray-800">
                            ✅ Correct Answer:{" "}
                            {Array.isArray(q.answer)
                              ? q.answer.join(", ")
                              : q.answer}
                          </p>
                        </div>
                      </details>
                    </div>
                  );
                })}

                {/* Buttons */}
                <div className="flex gap-3 justify-end pt-4 sticky bottom-0 bg-white pb-2">
                  <button
                    onClick={() => setGeneratedQuiz(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear Quiz
                  </button>

                  <button
                    onClick={() => {
                      const blob = new Blob(
                        [JSON.stringify(generatedQuiz, null, 2)],
                        {
                          type: "application/json",
                        },
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "quiz.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Export Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>
            Maximum 10 questions per quiz • Choose between text input or file
            upload • Supports Single Correct, Multiple Correct, and True/False
            question types
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
