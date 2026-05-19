import { useState } from "react";
import axios from "axios";
import { Brain, Zap, BookOpen, Target } from "lucide-react";

export default function SkillsGapPage() {
  const [form, setForm] = useState({
    current_skills: "",
    dream_job: "",
    experience: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!form.current_skills || !form.dream_job) {
      return alert("Please fill in your skills and dream job");
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: `You are a career skills expert for African professionals.
        
Analyze the skills gap for this person:
Current Skills: ${form.current_skills}
Dream Job: ${form.dream_job}
Years of Experience: ${form.experience || "Not specified"}

Provide a detailed response with:
1. **Skills You Already Have** that are relevant
2. **Critical Missing Skills** they must learn urgently
3. **Nice-to-Have Skills** that would boost their profile
4. **Learning Plan** with specific free resources for each missing skill
5. **Timeline** realistic time to be job-ready
6. **Quick Wins** skills they can learn in under 2 weeks`,
        history: []
      });
      setResult(res.data.response);
    } catch {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", backgroundColor: "#0F0F1A", padding: "24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #F472B6, #EC4899)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: "22px", fontWeight: "700",
              background: "linear-gradient(135deg, #F472B6, #A855F7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Skills Gap Analyzer
            </h1>
            <p style={{ color: "#6B7280", fontSize: "12px" }}>
              Discover exactly what skills you need for your dream job
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: "#1A1A2E",
        border: "1px solid #2A2A4A",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        {/* Dream Job */}
        <div>
          <label style={{
            color: "#F472B6", fontSize: "13px",
            fontWeight: "700", marginBottom: "8px", display: "block"
          }}>
            🎯 Your Dream Job
          </label>
          <input
            value={form.dream_job}
            onChange={e => setForm(prev => ({ ...prev, dream_job: e.target.value }))}
            placeholder="e.g. Senior Software Engineer at a US tech company"
            style={{
              width: "100%",
              background: "#0F0F1A",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "white",
              fontSize: "13px",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Current Skills */}
        <div>
          <label style={{
            color: "#A855F7", fontSize: "13px",
            fontWeight: "700", marginBottom: "8px", display: "block"
          }}>
            💡 Your Current Skills
          </label>
          <textarea
            value={form.current_skills}
            onChange={e => setForm(prev => ({ ...prev, current_skills: e.target.value }))}
            placeholder="List all your current skills e.g. Python, React, SQL, 2 years experience in web development..."
            rows={5}
            style={{
              width: "100%",
              background: "#0F0F1A",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "white",
              fontSize: "13px",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: "1.6"
            }}
          />
        </div>

        {/* Experience */}
        <div>
          <label style={{
            color: "#60A5FA", fontSize: "13px",
            fontWeight: "700", marginBottom: "8px", display: "block"
          }}>
            📅 Years of Experience
          </label>
          <input
            value={form.experience}
            onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))}
            placeholder="e.g. 2 years"
            style={{
              width: "100%",
              background: "#0F0F1A",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "white",
              fontSize: "13px",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading}
          style={{
            background: loading ? "#2A2A4A" : "linear-gradient(135deg, #F472B6, #A855F7)",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            color: "white",
            fontSize: "14px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 8px 25px #F472B630"
          }}
        >
          {loading ? "🤖 Analyzing your skills gap..." : "🔍 Analyze My Skills Gap"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{
          background: "#1A1A2E",
          border: "1px solid #F472B640",
          borderRadius: "20px",
          padding: "24px",
          animation: "slideUp 0.4s ease-out"
        }}>
          <h2 style={{
            color: "white", fontWeight: "700",
            fontSize: "16px", marginBottom: "16px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <BookOpen size={18} color="#F472B6" />
            Your Skills Gap Report
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {result.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} style={{ height: "4px" }} />;

              const numMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)/);
              if (numMatch) {
                return (
                  <div key={i} style={{
                    background: "#13131F",
                    border: "1px solid #2A2A4A",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex", gap: "12px"
                  }}>
                    <span style={{
                      background: "linear-gradient(135deg, #F472B6, #A855F7)",
                      borderRadius: "8px",
                      width: "28px", height: "28px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "700", color: "white",
                      flexShrink: 0
                    }}>
                      {numMatch[1]}
                    </span>
                    <div>
                      <p style={{
                        fontWeight: "700", fontSize: "13px",
                        background: "linear-gradient(135deg, #F472B6, #A855F7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "4px"
                      }}>
                        {numMatch[2]}
                      </p>
                      {numMatch[3] && (
                        <p style={{ color: "#D1D5DB", fontSize: "13px" }}>{numMatch[3]}</p>
                      )}
                    </div>
                  </div>
                );
              }

              const bulletMatch = line.match(/^[-•]\s+(.*)/);
              if (bulletMatch) {
                return (
                  <div key={i} style={{
                    display: "flex", gap: "10px",
                    padding: "4px 8px", alignItems: "flex-start"
                  }}>
                    <div style={{
                      width: "6px", height: "6px",
                      background: "linear-gradient(135deg, #F472B6, #A855F7)",
                      borderRadius: "50%",
                      marginTop: "8px", flexShrink: 0
                    }} />
                    <span style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.6" }}>
                      {bulletMatch[1].replace(/\*\*/g, "")}
                    </span>
                  </div>
                );
              }

              return (
                <p key={i} style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.7" }}>
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}