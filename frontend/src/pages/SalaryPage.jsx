import { useState } from "react";
import axios from "axios";
import { DollarSign, TrendingUp } from "lucide-react";

export default function SalaryPage() {
  const [form, setForm] = useState({
    job_title: "", experience: "", location: "Lagos, Nigeria", skills: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.job_title || !form.experience) return alert("Please fill all fields");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/salary", form);
      setResult(res.data);
    } catch (e) {
      alert("Failed: " + (e.response?.data?.detail || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const DEMAND_COLORS = {
    "High": "text-green-400 bg-green-900 border-green-700",
    "Medium": "text-yellow-400 bg-yellow-900 border-yellow-700",
    "Low": "text-red-400 bg-red-900 border-red-700",
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <DollarSign className="text-yellow-400" size={24} />
          Salary Advisor
        </h1>
        <p className="text-gray-400 text-sm mt-1">Know your worth in the African job market</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        {[
          { key: "job_title", label: "Job Title", placeholder: "e.g. Software Engineer" },
          { key: "experience", label: "Years of Experience", placeholder: "e.g. 3 years" },
          { key: "location", label: "Location", placeholder: "e.g. Lagos, Nigeria" },
          { key: "skills", label: "Key Skills", placeholder: "e.g. Python, React, AWS" },
        ].map(field => (
          <div key={field.key}>
            <label className="text-white text-sm font-semibold mb-2 block">{field.label}</label>
            <input
              value={form[field.key]}
              onChange={e => setForm(prev => ({...prev, [field.key]: e.target.value}))}
              placeholder={field.placeholder}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        ))}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 text-black font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Analyzing Market Data..." : "Get Salary Insights"}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Salary Range */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Minimum", value: result.salary_range?.minimum, color: "text-red-400" },
              { label: "Average", value: result.salary_range?.average, color: "text-yellow-400" },
              { label: "Maximum", value: result.salary_range?.maximum, color: "text-green-400" },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Market Demand */}
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-yellow-400" size={20} />
              <span className="text-white font-semibold">Market Demand</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${DEMAND_COLORS[result.market_demand] || "text-gray-400 bg-gray-800 border-gray-600"}`}>
              {result.market_demand}
            </span>
          </div>

          {/* Negotiation Tips */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-yellow-400 font-bold mb-3">💡 Negotiation Tips</h3>
            <ul className="space-y-2">
              {result.negotiation_tips?.map((tip, i) => (
                <li key={i} className="text-gray-300 text-sm flex gap-2">
                  <span className="text-yellow-400 flex-shrink-0">{i+1}.</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Negotiation Script */}
          <div className="bg-yellow-950 border border-yellow-800 rounded-2xl p-5">
            <h3 className="text-yellow-400 font-bold mb-3">🎤 Word-for-Word Negotiation Script</h3>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "{result.negotiation_script}"
            </p>
          </div>

          {/* Skills that increase salary */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-white font-bold mb-3">🚀 Skills That Increase Your Salary</h3>
            <div className="flex flex-wrap gap-2">
              {result.skills_that_increase_salary?.map((skill, i) => (
                <span key={i} className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}