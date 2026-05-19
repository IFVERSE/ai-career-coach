import { useState, useEffect } from "react";
import axios from "axios";
import {
  Sparkles, FileText, Mic, DollarSign,
  Map, Mail, TrendingUp, Zap,
  Award, Target, Clock, RefreshCw,
  LayoutDashboard, Brain, Star
} from "lucide-react";

const QUICK_ACTIONS = [
  { id: "chat",        label: "Career Chat",        icon: Sparkles, color: "#A855F7", bg: "#A855F715" },
  { id: "cv",          label: "Review My CV",        icon: FileText, color: "#60A5FA", bg: "#60A5FA15" },
  { id: "interview",   label: "Practice Interview",  icon: Mic,      color: "#34D399", bg: "#34D39915" },
  { id: "salary",      label: "Salary Advisor",      icon: DollarSign,color: "#FBBF24",bg: "#FBBF2415" },
  { id: "roadmap",     label: "Career Roadmap",      icon: Map,      color: "#F472B6", bg: "#F472B615" },
  { id: "coverletter", label: "Cover Letter",        icon: Mail,     color: "#FB923C", bg: "#FB923C15" },
  { id: "jobmatch",    label: "Job Match Analyzer",  icon: Brain,    color: "#34D399", bg: "#34D39915" },
  { id: "skillsgap",   label: "Skills Gap Analyzer", icon: Brain,    color: "#F472B6", bg: "#F472B615" },
  { id: "linkedin", label: "LinkedIn Optimizer", icon: Sparkles, color: "#60A5FA", bg: "#60A5FA15" },
];

const STATS = [
  { label: "AI Features",   value: "9",         icon: Zap,      color: "#6C63FF" },
  { label: "AI Model",      value: "LLaMA 3.3", icon: Star,     color: "#FBBF24" },
  { label: "Response Time", value: "~10s",      icon: Clock,    color: "#34D399" },
  { label: "Accuracy",      value: "95%",       icon: Target,   color: "#F472B6" },
];

const CAREER_FACTS = [
  "🌍 Africa has the world's fastest growing tech talent pool",
  "💡 Nigerian tech professionals earn up to 3x more with remote jobs",
  "🚀 AI skills can increase your salary by 40-60% in Africa",
  "📈 Lagos is ranked Africa's #1 tech hub",
  "🎯 Professionals with strong CVs get 3x more interviews",
  "💼 Remote work opportunities for Africans grew by 200% since 2020",
];

const CATEGORY_COLORS = {
  "Networking": { bg: "#60A5FA15", border: "#60A5FA40", text: "#60A5FA" },
  "Skills":     { bg: "#34D39915", border: "#34D39940", text: "#34D399" },
  "Mindset":    { bg: "#A855F715", border: "#A855F740", text: "#A855F7" },
  "Job Search": { bg: "#FBBF2415", border: "#FBBF2440", text: "#FBBF24" },
  "Salary":     { bg: "#F472B615", border: "#F472B640", text: "#F472B6" },
};

export default function DashboardPage({ setActivePage }) {
  const [tip, setTip] = useState(null);
  const [tipLoading, setTipLoading] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchTip();

    const interval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % CAREER_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchTip = async () => {
    setTipLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/daily-tip");
      setTip(res.data);
    } catch {
      setTip({
        tip: "Update your LinkedIn profile today — 87% of recruiters use it to find candidates.",
        category: "Networking",
        action: "Add 3 new skills to your LinkedIn profile right now."
      });
    } finally {
      setTipLoading(false);
    }
  };

  const tipColors = CATEGORY_COLORS[tip?.category] || CATEGORY_COLORS["Skills"];

  return (
    <div style={{ height: "100%", overflowY: "auto", backgroundColor: "#0F0F1A", padding: "24px" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #6C63FF20, #FF658415, #00D4FF10)",
        border: "1px solid #6C63FF30",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "150px", height: "150px",
          background: "radial-gradient(circle, #6C63FF20, transparent)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "30%",
          width: "100px", height: "100px",
          background: "radial-gradient(circle, #FF658420, transparent)",
          borderRadius: "50%"
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            padding: "4px 12px",
            background: "#6C63FF20",
            border: "1px solid #6C63FF40",
            borderRadius: "999px",
            fontSize: "11px",
            color: "#A78BFA",
            fontWeight: "600",
            marginBottom: "12px"
          }}>
            🌍 AI Career Coach Africa
          </div>

          <h1 style={{
            fontSize: "28px", fontWeight: "800",
            background: "linear-gradient(135deg, #ffffff, #A78BFA, #60A5FA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>
            {greeting}! 👋
          </h1>

          <p style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "16px" }}>
            Your AI-powered career coach is ready. Choose a tool below to get started.
          </p>

          {/* Rotating Facts */}
          <div style={{
            background: "#0F0F1A60",
            border: "1px solid #2A2A4A",
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <TrendingUp size={16} color="#34D399" />
            <p style={{ color: "#D1D5DB", fontSize: "13px" }}>
              {CAREER_FACTS[factIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
        marginBottom: "20px"
      }}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{
              background: "#1A1A2E",
              border: "1px solid #2A2A4A",
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "default"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = stat.color + "60";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 25px ${stat.color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#2A2A4A";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Icon size={20} color={stat.color} style={{ margin: "0 auto 8px" }} />
              <p style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>{stat.value}</p>
              <p style={{ color: "#6B7280", fontSize: "10px" }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Daily Tip */}
      <div style={{
        background: tip ? `linear-gradient(135deg, ${tipColors.bg}, #1A1A2E)` : "#1A1A2E",
        border: `1px solid ${tip ? tipColors.border : "#2A2A4A"}`,
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "20px"
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} color="#FBBF24" />
            <span style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>
              💡 Daily Career Tip
            </span>
            {tip && (
              <span style={{
                padding: "2px 10px",
                background: tipColors.bg,
                border: `1px solid ${tipColors.border}`,
                borderRadius: "999px",
                fontSize: "10px",
                color: tipColors.text,
                fontWeight: "600"
              }}>
                {tip.category}
              </span>
            )}
          </div>
          <button
            onClick={fetchTip}
            disabled={tipLoading}
            title="Get new tip"
            style={{
              background: "none", border: "1px solid #2A2A4A",
              borderRadius: "8px", padding: "6px",
              cursor: "pointer", color: "#6B7280",
              display: "flex", alignItems: "center"
            }}
          >
            <RefreshCw
              size={14}
              color={tipLoading ? "#6C63FF" : "#6B7280"}
              style={{ animation: tipLoading ? "spin 1s linear infinite" : "none" }}
            />
          </button>
        </div>

        {tipLoading ? (
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "8px 0" }}>
            {[0, 150, 300].map((delay, i) => (
              <div key={i} style={{
                width: "8px", height: "8px",
                background: "#6C63FF", borderRadius: "50%",
                animation: `bounce-dot 1s ease-in-out ${delay}ms infinite`
              }} />
            ))}
            <span style={{ color: "#6B7280", fontSize: "12px", marginLeft: "8px" }}>
              Getting your tip...
            </span>
          </div>
        ) : tip ? (
          <div>
            <p style={{ color: "#E5E7EB", fontSize: "14px", lineHeight: "1.7", marginBottom: "12px" }}>
              {tip.tip}
            </p>
            <div style={{
              background: "#0F0F1A",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <Target size={14} color="#34D399" />
              <p style={{ color: "#34D399", fontSize: "12px", fontWeight: "600" }}>
                Today's Action: {tip.action}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{
          color: "white", fontSize: "16px",
          fontWeight: "700", marginBottom: "14px",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <Zap size={18} color="#6C63FF" />
          All Features
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px"
        }}>
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => setActivePage(action.id)}
                style={{
                  background: action.bg,
                  border: `1px solid ${action.color}30`,
                  borderRadius: "16px",
                  padding: "18px 14px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 30px ${action.color}25`;
                  e.currentTarget.style.borderColor = action.color + "70";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = action.color + "30";
                }}
              >
                <div style={{
                  width: "44px", height: "44px",
                  background: action.color + "20",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={22} color={action.color} />
                </div>
                <span style={{ color: "white", fontSize: "12px", fontWeight: "600", lineHeight: "1.3" }}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "16px",
        background: "#1A1A2E",
        border: "1px solid #2A2A4A",
        borderRadius: "16px"
      }}>
        <p style={{
          fontSize: "12px",
          background: "linear-gradient(135deg, #6C63FF, #FF6584, #00D4FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "600"
        }}>
          🚀 CareerCoach Africa — Empowering African Professionals with AI
        </p>
      </div>
    </div>
  );
}