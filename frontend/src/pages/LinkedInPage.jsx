import { useState } from "react";
import axios from "axios";
import { Sparkles, Copy, CheckCircle } from "lucide-react";

export default function LinkedInPage() {
  const [form, setForm] = useState({
    name: "",
    current_role: "",
    experience: "",
    skills: "",
    achievements: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const optimize = async () => {
    if (!form.name || !form.current_role) {
      return alert("Please fill in your name and current role");
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: `You are a LinkedIn optimization expert for African professionals.
        
Optimize the LinkedIn profile for:
Name: ${form.name}
Current Role: ${form.current_role}
Experience: ${form.experience}
Key Skills: ${form.skills}
Key Achievements: ${form.achievements}

Provide:
1. **Optimized Headline** (max 220 chars, keyword-rich, attention-grabbing)
2. **Powerful About Section** (first-person, story-driven, 3 paragraphs)
3. **Top 10 Skills to Add** to their LinkedIn profile
4. **Connection Request Message** template to send to recruiters
5. **Profile Optimization Tips** specific to African professionals seeking global opportunities`,
        history: []
      });
      setResult(res.data.response);
    } catch {
      alert("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", backgroundColor: "#0F0F1A", padding: "24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #0077B5, #00A0DC)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: "22px", fontWeight: "700",
              background: "linear-gradient(135deg, #0077B5, #00A0DC, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              LinkedIn Optimizer
            </h1>
            <p style={{ color: "#6B7280", fontSize: "12px" }}>
              AI rewrites your LinkedIn to attract global recruiters
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
        {[
          { key: "name",         label: "👤 Full Name",          placeholder: "e.g. Ayuk Johnson",                        color: "#60A5FA" },
          { key: "current_role", label: "💼 Current Role/Title",  placeholder: "e.g. Software Engineer",                   color: "#A855F7" },
          { key: "experience",   label: "📅 Years of Experience", placeholder: "e.g. 3 years in full-stack development",   color: "#34D399" },
          { key: "skills",       label: "⚡ Key Skills",          placeholder: "e.g. Python, React, FastAPI, AI, Docker",  color: "#FBBF24" },
          { key: "achievements", label: "🏆 Key Achievements",    placeholder: "e.g. Built an AI tool used by 500+ people, led a team of 5...", color: "#F472B6" },
        ].map(field => (
          <div key={field.key}>
            <label style={{
              color: field.color, fontSize: "13px",
              fontWeight: "700", marginBottom: "8px", display: "block"
            }}>
              {field.label}
            </label>
            {field.key === "achievements" ? (
              <textarea
                value={form[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                rows={3}
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
            ) : (
              <input
                value={form[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
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
            )}
          </div>
        ))}

        <button
          onClick={optimize}
          disabled={loading}
          style={{
            background: loading ? "#2A2A4A" : "linear-gradient(135deg, #0077B5, #00A0DC)",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            color: "white",
            fontSize: "14px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 8px 25px #0077B530"
          }}
        >
          {loading ? "✨ Optimizing your LinkedIn..." : "🚀 Optimize My LinkedIn Profile"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{
          background: "#1A1A2E",
          border: "1px solid #0077B540",
          borderRadius: "20px",
          padding: "24px",
          animation: "slideUp 0.4s ease-out"
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "16px"
          }}>
            <h2 style={{
              color: "white", fontWeight: "700", fontSize: "16px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <Sparkles size={18} color="#0077B5" />
              Your Optimized LinkedIn Profile
            </h2>
            <button
              onClick={() => copyText(result, "all")}
              style={{
                background: copied === "all" ? "#34D39920" : "#1A1A2E",
                border: `1px solid ${copied === "all" ? "#34D399" : "#2A2A4A"}`,
                borderRadius: "8px",
                padding: "6px 12px",
                color: copied === "all" ? "#34D399" : "#9CA3AF",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              {copied === "all"
                ? <><CheckCircle size={12} /> Copied!</>
                : <><Copy size={12} /> Copy All</>
              }
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {result.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} style={{ height: "4px" }} />;

              const numMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)/);
              if (numMatch) {
                return (
                  <div key={i} style={{
                    background: "#13131F",
                    border: "1px solid #0077B530",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex", gap: "12px"
                  }}>
                    <span style={{
                      background: "linear-gradient(135deg, #0077B5, #00A0DC)",
                      borderRadius: "8px",
                      width: "28px", height: "28px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "700", color: "white",
                      flexShrink: 0
                    }}>
                      {numMatch[1]}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: "700", fontSize: "13px",
                        background: "linear-gradient(135deg, #0077B5, #60A5FA)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "6px"
                      }}>
                        {numMatch[2]}
                      </p>
                      {numMatch[3] && (
                        <p style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.6" }}>
                          {numMatch[3]}
                        </p>
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
                      background: "#0077B5",
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