import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Upload, FileText, Star, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function CVPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/api/cv-review", formData);
      setResult(res.data);
    } catch (e) {
      alert("CV review failed: " + (e.response?.data?.detail || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1
  });

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-400";
    if (score >= 60) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="text-blue-400" size={24} />
          CV Reviewer
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload your CV and get instant AI-powered feedback
        </p>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? "border-blue-400 bg-blue-400/10" : "border-border hover:border-blue-400 hover:bg-blue-400/5"}
        `}
      >
        <input {...getInputProps()} />
        <Upload size={40} className={`mx-auto mb-4 ${isDragActive ? "text-blue-400" : "text-gray-500"}`} />
        {loading ? (
          <div>
            <p className="text-blue-400 font-semibold animate-pulse">🤖 AI is reviewing your CV...</p>
            <p className="text-gray-500 text-sm mt-2">This takes 15-30 seconds</p>
          </div>
        ) : (
          <div>
            <p className="text-white font-semibold">Drop your CV here</p>
            <p className="text-gray-400 text-sm mt-2">Supports PDF and TXT files</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-slide-up">

          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-2">Overall Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(result.overall_score)}`}>
                {result.overall_score}
              </p>
              <p className="text-gray-500 text-xs mt-1">out of 100</p>
              <div className="mt-3 bg-border rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBg(result.overall_score)}`}
                  style={{width: `${result.overall_score}%`}}
                />
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-2">ATS Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(result.ats_score)}`}>
                {result.ats_score}
              </p>
              <p className="text-gray-500 text-xs mt-1">applicant tracking</p>
              <div className="mt-3 bg-border rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBg(result.ats_score)}`}
                  style={{width: `${result.ats_score}%`}}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <Star className="text-yellow-400" size={18} /> Summary
            </h3>
            <p className="text-gray-300 text-sm">{result.summary}</p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <CheckCircle size={18} /> Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-950 border border-red-800 rounded-2xl p-5">
              <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                <XCircle size={18} /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {result.weaknesses?.map((w, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-red-400 flex-shrink-0">✗</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <AlertCircle size={18} /> Recommended Improvements
            </h3>
            <ul className="space-y-2">
              {result.improvements?.map((imp, i) => (
                <li key={i} className="text-gray-300 text-sm flex gap-2">
                  <span className="text-yellow-400 font-bold flex-shrink-0">{i+1}.</span> {imp}
                </li>
              ))}
            </ul>
          </div>

          {/* Rewritten Summary */}
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5">
            <h3 className="text-primary font-bold mb-3">✨ AI-Rewritten Professional Summary</h3>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "{result.rewritten_summary}"
            </p>
          </div>

          {/* Suitable Job Titles */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-white font-bold mb-3">💼 Suitable Job Titles</h3>
            <div className="flex flex-wrap gap-2">
              {result.job_titles?.map((title, i) => (
                <span key={i} className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm">
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}