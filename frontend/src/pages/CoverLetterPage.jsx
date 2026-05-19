import { useState } from "react";
import axios from "axios";
import { Mail, Copy, CheckCircle } from "lucide-react";

export default function CoverLetterPage() {
  const [form, setForm] = useState({
    name: "", job_title: "", company: "", experience: "", skills: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    if (!form.name || !form.job_title || !form.company) return alert("Please fill required fields");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/cover-letter", form);
      setResult(res.data);
    } catch (e) {
      alert("Failed: " + (e.response?.data?.detail || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="text-orange-400" size={24} />
          Cover Letter Writer
        </h1>
        <p className="text-gray-400 text-sm mt-1">AI writes your perfect cover letter instantly</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        {[
          { key: "name", label: "Your Full Name *", placeholder: "e.g. Ayuk Johnson" },
          { key: "job_title", label: "Job Title *", placeholder: "e.g. Software Engineer" },
          { key: "company", label: "Company Name *", placeholder: "e.g. Google Nigeria" },
          { key: "experience", label: "Your Experience", placeholder: "e.g. 3 years in backend development" },
          { key: "skills", label: "Key Skills", placeholder: "e.g. Python, FastAPI, React, Docker" },
        ].map(field => (
          <div key={field.key}>
            <label className="text-white text-sm font-semibold mb-2 block">{field.label}</label>
            <input
              value={form[field.key]}
              onChange={e => setForm(prev => ({...prev, [field.key]: e.target.value}))}
              placeholder={field.placeholder}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-400 transition-colors"
            />
          </div>
        ))}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Writing Your Cover Letter..." : "Generate Cover Letter"}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Subject Line */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-orange-400 text-xs font-semibold mb-1">EMAIL SUBJECT LINE</p>
            <p className="text-white font-medium">{result.subject_line}</p>
          </div>

          {/* Cover Letter */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">📄 Your Cover Letter</h3>
              <button
                onClick={copyLetter}
                className="flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-3 py-1.5 rounded-xl text-sm transition-colors"
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-dark rounded-xl p-4">
              {result.cover_letter}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-orange-950 border border-orange-800 rounded-2xl p-5">
            <h3 className="text-orange-400 font-bold mb-2">💡 Application Tips</h3>
            <p className="text-gray-300 text-sm">{result.tips}</p>
          </div>
        </div>
      )}
    </div>
  );
}