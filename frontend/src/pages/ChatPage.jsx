import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Sparkles, Zap } from "lucide-react";

const SUGGESTIONS = [
  "💰 How do I negotiate salary in Nigeria?",
  "🌍 How do I get a remote job from Africa?",
  "📄 What makes a great CV stand out?",
  "🎤 How do I ace a technical interview?",
  "🚀 What are the highest paying tech skills?",
];

// ─── Message Renderer ───────────────────────────────────────
function MessageRenderer({ content, isUser }) {
  if (isUser) {
    return (
      <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
        {content}
      </p>
    );
  }

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{
            fontWeight: "700",
            background: "linear-gradient(135deg, #A78BFA, #60A5FA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderContent = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Empty line
      if (line.trim() === "") {
        elements.push(<div key={i} style={{ height: "8px" }} />);
        i++;
        continue;
      }

      // Numbered list: "1. **Title**: description"
      const numberedMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)/);
      if (numberedMatch) {
        const [, num, title, desc] = numberedMatch;
        elements.push(
          <div key={i} style={{
            display: "flex",
            gap: "12px",
            padding: "10px 14px",
            marginBottom: "6px",
            background: "linear-gradient(135deg, #6C63FF10, #A855F710)",
            border: "1px solid #6C63FF25",
            borderRadius: "12px",
            alignItems: "flex-start",
          }}>
            <div style={{
              minWidth: "26px", height: "26px",
              background: "linear-gradient(135deg, #6C63FF, #A855F7)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "700", color: "white",
              flexShrink: 0
            }}>
              {num}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{
                fontWeight: "700", fontSize: "13px",
                background: "linear-gradient(135deg, #A78BFA, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                {title}
              </span>
              {desc && (
                <span style={{ color: "#D1D5DB", fontSize: "13px" }}>
                  {" "}— {desc}
                </span>
              )}
            </div>
          </div>
        );
        i++;
        continue;
      }

      // Numbered line without bold: "1. plain text"
      const simplNumbered = line.match(/^(\d+)\.\s+(.*)/);
      if (simplNumbered) {
        const [, num, text] = simplNumbered;
        elements.push(
          <div key={i} style={{
            display: "flex",
            gap: "12px",
            padding: "8px 14px",
            marginBottom: "4px",
            background: "#1E1E30",
            border: "1px solid #2A2A4A",
            borderRadius: "10px",
            alignItems: "flex-start",
          }}>
            <div style={{
              minWidth: "24px", height: "24px",
              background: "linear-gradient(135deg, #6C63FF, #A855F7)",
              borderRadius: "6px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "700", color: "white",
              flexShrink: 0
            }}>
              {num}
            </div>
            <span style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.6" }}>
              {renderInline(text)}
            </span>
          </div>
        );
        i++;
        continue;
      }

      // Bullet point: "- text" or "• text"
      const bulletMatch = line.match(/^[-•]\s+(.*)/);
      if (bulletMatch) {
        elements.push(
          <div key={i} style={{
            display: "flex",
            gap: "10px",
            padding: "6px 4px",
            alignItems: "flex-start"
          }}>
            <div style={{
              width: "6px", height: "6px",
              background: "linear-gradient(135deg, #6C63FF, #FF6584)",
              borderRadius: "50%",
              marginTop: "8px",
              flexShrink: 0
            }} />
            <span style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.6" }}>
              {renderInline(bulletMatch[1])}
            </span>
          </div>
        );
        i++;
        continue;
      }

      // Bold-only line heading
      if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
        const heading = line.trim().slice(2, -2);
        elements.push(
          <p key={i} style={{
            fontWeight: "700",
            fontSize: "14px",
            background: "linear-gradient(135deg, #A78BFA, #60A5FA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "10px 0 4px 0",
          }}>
            {heading}
          </p>
        );
        i++;
        continue;
      }

      // Salary highlight: contains ₦
      if (line.includes("₦") || line.toLowerCase().includes("per annum")) {
        elements.push(
          <div key={i} style={{
            display: "inline-flex",
            padding: "5px 14px",
            background: "linear-gradient(135deg, #FBBF2415, #F59E0B15)",
            border: "1px solid #FBBF2440",
            borderRadius: "999px",
            fontSize: "12px",
            color: "#FCD34D",
            fontWeight: "600",
            marginBottom: "4px"
          }}>
            💰 {renderInline(line)}
          </div>
        );
        i++;
        continue;
      }

      // Section divider line
      if (line.trim().startsWith("---")) {
        elements.push(
          <div key={i} style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, #6C63FF50, transparent)",
            margin: "10px 0"
          }} />
        );
        i++;
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={i} style={{
          color: "#D1D5DB",
          fontSize: "13px",
          lineHeight: "1.7",
          margin: "3px 0"
        }}>
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return <div style={{ width: "100%" }}>{renderContent(content)}</div>;
}

// ─── Main ChatPage ───────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "👋 Hello! I'm CareerCoach Africa — your personal AI career advisor!\n\nI help African professionals:\n📄 Get better CVs and more interviews\n🎤 Ace interviews with confidence\n💰 Negotiate salaries they deserve\n🗺️ Build clear career roadmaps\n✉️ Write powerful cover letters\n\nWhat career challenge can I help you with today?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userText,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0F0F1A" }}>

      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid #2A2A4A",
        background: "linear-gradient(135deg, #6C63FF10, #FF658410)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #6C63FF, #A855F7)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "float 3s ease-in-out infinite"
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: "20px", fontWeight: "700",
              background: "linear-gradient(135deg, #6C63FF, #FF6584, #00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Career Chat
            </h1>
            <p style={{ color: "#6B7280", fontSize: "12px" }}>
              AI Career Advisor • Always Online
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "8px", height: "8px",
              backgroundColor: "#34D399",
              borderRadius: "50%",
              animation: "pulse 2s infinite"
            }} />
            <span style={{ color: "#34D399", fontSize: "12px" }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "24px",
        display: "flex", flexDirection: "column", gap: "16px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "12px",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "slideUp 0.3s ease-out"
          }}>
            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, #6C63FF, #A855F7)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: "4px"
              }}>
                <Bot size={18} color="white" />
              </div>
            )}

            {/* Message Bubble */}
            <div style={{
              maxWidth: msg.role === "user" ? "65%" : "80%",
              padding: "14px 18px",
              borderRadius: msg.role === "user"
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #6C63FF, #8B5CF6)"
                : "#1A1A2E",
              border: msg.role === "user"
                ? "none"
                : "1px solid #2A2A4A",
              color: "white",
              boxShadow: msg.role === "user"
                ? "0 4px 20px #6C63FF30"
                : "0 2px 10px #00000030"
            }}>
              <MessageRenderer
                content={msg.content}
                isUser={msg.role === "user"}
              />

              {/* Timestamp */}
              <p style={{
                fontSize: "10px",
                color: msg.role === "user" ? "#C4B5FD" : "#4B5563",
                marginTop: "6px",
                textAlign: "right"
              }}>
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, #FF6584, #FF8C69)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: "4px"
              }}>
                <User size={18} color="white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #6C63FF, #A855F7)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{
              background: "#1A1A2E",
              border: "1px solid #2A2A4A",
              borderRadius: "18px 18px 18px 4px",
              padding: "16px 20px",
              display: "flex", gap: "6px", alignItems: "center"
            }}>
              <span style={{ color: "#6B7280", fontSize: "12px", marginRight: "8px" }}>
                Thinking
              </span>
              {[0, 150, 300].map((delay, idx) => (
                <div key={idx} style={{
                  width: "8px", height: "8px",
                  background: "linear-gradient(135deg, #6C63FF, #A855F7)",
                  borderRadius: "50%",
                  animation: `bounce-dot 1s ease-in-out ${delay}ms infinite`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: "0 24px 12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              style={{
                background: "linear-gradient(135deg, #6C63FF10, #A855F710)",
                border: "1px solid #6C63FF30",
                borderRadius: "999px",
                padding: "8px 16px",
                color: "#A78BFA",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontWeight: "500"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, #6C63FF30, #A855F730)";
                e.currentTarget.style.borderColor = "#6C63FF";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, #6C63FF10, #A855F710)";
                e.currentTarget.style.borderColor = "#6C63FF30";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #2A2A4A" }}>
        <div style={{
          display: "flex",
          gap: "12px",
          background: "#1A1A2E",
          border: "1px solid #2A2A4A",
          borderRadius: "16px",
          padding: "12px 16px",
        }}>
          <Zap size={18} color="#6C63FF" style={{ marginTop: "2px", flexShrink: 0 }} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about your career... (Press Enter to send)"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "14px",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: "1.5"
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #6C63FF, #8B5CF6)"
                : "#2A2A4A",
              border: "none",
              borderRadius: "10px",
              padding: "8px 14px",
              cursor: input.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              flexShrink: 0,
              boxShadow: input.trim() ? "0 4px 15px #6C63FF40" : "none"
            }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
        <p style={{ color: "#4B5563", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}