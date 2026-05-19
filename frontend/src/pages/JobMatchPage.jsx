import { useState } from "react";
import axios from "axios";
import { Brain, Target, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function JobMatchPage() {
  const [jobDesc, setJobDesc] = useState("");
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!jobDesc.trim() || !cvText.trim()) {
      return alert("Please fill in both fields");
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: `Analyze how well this candidate matches this job. 
        
JOB DESCRIPTION:
${jobDesc}

CANDIDATE CV/PROFILE:
${cvText}

Respond with:
1. **Match Score**: X/100
2. **Match Level**: (Excellent/Good/Fair/Poor)
3. **Matching Skills**: list what matches
4. **Missing Skills**: list what's missing
5. **Recommendations**: specific steps to improve match
6. **Should They Apply?**: yes/no and why`,
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
            background: "linear-gradient(135deg, #34D399, #059669)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Target size={20} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: "22px", fontWeight: "700",
              background: "linear-gradient(135deg, #34D399, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Job Match Analyzer
            </h1>
            <p style={{ color: "#6B7280", fontSize: "12px" }}>
              See how well you match a job before applying
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

        {/* Job Description */}
        <div style={{
          background: "#1A1A2E",
          border: "1px solid #2A2A4A",
          borderRadius: "16px",
          padding: "16px"
        }}>
          <label style={{
            color: "#34D399", fontSize: "13px",
            fontWeight: "700", marginBottom: "10px",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            📋 Job Description
          </label>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={12}
            style={{
              width: "100%",
              background: "#0F0F1A",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "12px",
              color: "white",
              fontSize: "13px",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: "1.6"
            }}
          />
        </div>

        {/* CV/Profile */}
        <div style={{
          background: "#1A1A2E",
          border: "1px solid #2A2A4A",
          borderRadius: "16px",
          padding: "16px"
        }}>
          <label style={{
            color: "#60A5FA", fontSize: "13px",
            fontWeight: "700", marginBottom: "10px",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            👤 Your CV / Profile Summary
          </label>
          <textarea
            value={cvText}
            onChange={e => setCvText(e.target.value)}
            placeholder="Paste your CV content or write a summary of your skills and experience..."
            rows={12}
            style={{
              width: "100%",
              background: "#0F0F1A",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "12px",
              color: "white",
              fontSize: "13px",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: "1.6"
            }}
          />
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyze}
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#2A2A4A" : "linear-gradient(135deg, #34D399, #059669)",
          border: "none",
          borderRadius: "14px",
          padding: "16px",
          color: "white",
          fontSize: "15px",
          fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "24px",
          transition: "all 0.3s ease",
          boxShadow: loading ? "none" : "0 8px 25px #34D39930"
        }}
      >
        {loading ? "🤖 AI is analyzing your match..." : "⚡ Analyze My Job Match"}
      </button>

      {/* Results */}
      {result && (
        <div style={{
          background: "#1A1A2E",
          border: "1px solid #34D39940",
          borderRadius: "20px",
          padding: "24px",
          animation: "slideUp 0.4s ease-out"
        }}>
          <h2 style={{
            color: "white", fontWeight: "700",
            fontSize: "16px", marginBottom: "16px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <Brain size={18} color="#34D399" />
            Match Analysis Results
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {result.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} style={{ height: "4px" }} />;

              // Score line
              if (line.includes("Match Score") || line.includes("/100")) {
                return (
                  <div key={i} style={{
                    background: "linear-gradient(135deg, #34D39920, #059669 10)",
                    border: "1px solid #34D39940",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#34D399"
                  }}>
                    🎯 {line.replace(/\*\*/g, "")}
                  </div>
                );
              }

              // Numbered items
              const numMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)/);
              if (numMatch) {
                return (
                  <div key={i} style={{
                    background: "#13131F",
                    border: "1px solid #2A2A4A",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    display: "flex", gap: "12px"
                  }}>
                    <span style={{
                      background: "linear-gradient(135deg, #34D399, #059669)",
                      borderRadius: "6px",
                      width: "24px", height: "24px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "700", color: "white",
                      flexShrink: 0
                    }}>
                      {numMatch[1]}
                    </span>
                    <div>
                      <span style={{
                        fontWeight: "700", fontSize: "13px",
                        background: "linear-gradient(135deg, #34D399, #60A5FA)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}>
                        {numMatch[2]}
                      </span>
                      {numMatch[3] && (
                        <p style={{ color: "#D1D5DB", fontSize: "13px", marginTop: "4px" }}>
                          {numMatch[3]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              // Bullet points
              const bulletMatch = line.match(/^[-•]\s+(.*)/);
              if (bulletMatch) {
                return (
                  <div key={i} style={{
                    display: "flex", gap: "10px",
                    padding: "4px 8px", alignItems: "flex-start"
                  }}>
                    <div style={{
                      width: "6px", height: "6px",
                      background: "#34D399", borderRadius: "50%",
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