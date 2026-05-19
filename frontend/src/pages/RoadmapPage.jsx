import { useState } from "react";
import axios from "axios";
import { Map, ChevronRight, Clock } from "lucide-react";

export default function RoadmapPage() {
  const [form, setForm] = useState({ current_role: "", target_role: "", experience: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.current_role || !form.target_role) return alert("Please fill all fields");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/roadmap", form);
      setResult(res.data);
    } catch (e) {
      alert("Failed: " + (e.response?.data?.detail || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Map className="text-pink-400" size={24} />
          Career Roadmap
        </h1>
        <p className="text-gray-400 text-sm mt-1">Get your personalized step-by-step career plan</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        {[
          { key: "current_role", label: "Current Role", placeholder: "e.g. Junior Developer" },
          { key: "target_role", label: "Target Role", placeholder: "e.g. Senior Software Engineer" },
          { key: "experience", label: "Years of Experience", placeholder: "e.g. 2 years" },
        ].map(field => (
          <div key={field.key}>
            <label className="text-white text-sm font-semibold mb-2 block">{field.label}</label>
            <input
              value={form[field.key]}
              onChange={e => setForm(prev => ({...prev, [field.key]: e.target.value}))}
              placeholder={field.placeholder}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-pink-400 transition-colors"
            />
          </div>
        ))}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-400 disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Building Your Roadmap..." : "Generate Career Roadmap"}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <Clock className="text-pink-400 mx-auto mb-2" size={24} />
              <p className="text-gray-400 text-xs">Estimated Time</p>
              <p className="text-white font-bold">{result.estimated_time}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <ChevronRight className="text-pink-400 mx-auto mb-2" size={24} />
              <p className="text-gray-400 text-xs">Difficulty</p>
              <p className="text-white font-bold">{result.difficulty}</p>
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-4">
            {result.steps?.map((step, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white font-bold">{step.phase}</p>
                    <p className="text-gray-500 text-xs">{step.duration}</p>
                  </div>
                </div>

                <div className="space-y-3 ml-11">
                  <div>
                    <p className="text-pink-400 text-xs font-semibold mb-1">ACTIONS</p>
                    <ul className="space-y-1">
                      {step.actions?.map((a, j) => (
                        <li key={j} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-pink-400">→</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-pink-400 text-xs font-semibold mb-1">SKILLS TO LEARN</p>
                    <div className="flex flex-wrap gap-1">
                      {step.skills_to_learn?.map((s, j) => (
                        <span key={j} className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-pink-950 border border-pink-800 rounded-xl p-3">
                    <p className="text-pink-300 text-xs font-semibold">🎯 MILESTONE</p>
                    <p className="text-gray-300 text-sm mt-1">{step.milestone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Motivation */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-5 text-center">
            <p className="text-2xl mb-2">🌟</p>
            <p className="text-white font-semibold italic">"{result.motivation}"</p>
          </div>
        </div>
      )}
    </div>
  );
}