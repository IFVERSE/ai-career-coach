import { useState } from "react";
import {
  FileText, Mic, DollarSign, Map,
  Mail, MessageCircle, Menu, X,
  Briefcase, LayoutDashboard
} from "lucide-react";

const navItems = [
  { id: "dashboard",   label: "Dashboard",       icon: LayoutDashboard, color: "#00D4FF" },
  { id: "chat",        label: "Career Chat",      icon: MessageCircle,   color: "#A855F7" },
  { id: "cv",          label: "CV Reviewer",      icon: FileText,        color: "#60A5FA" },
  { id: "interview",   label: "Interview Coach",  icon: Mic,             color: "#34D399" },
  { id: "salary",      label: "Salary Advisor",   icon: DollarSign,      color: "#FBBF24" },
  { id: "roadmap",     label: "Career Roadmap",   icon: Map,             color: "#F472B6" },
  { id: "coverletter", label: "Cover Letter",     icon: Mail,            color: "#FB923C" },
  { id: "jobboard", label: "Live Job Board", icon: Briefcase, color: "#34D399" },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      width: collapsed ? "70px" : "220px",
      backgroundColor: "#13131F",
      borderRight: "1px solid #2A2A4A",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid #2A2A4A",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #6C63FF, #FF6584)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Briefcase size={18} color="white" />
            </div>
            <div>
              <p style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>
                CareerCoach
              </p>
              <p style={{
                fontSize: "10px",
                background: "linear-gradient(135deg, #6C63FF, #FF6584)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                🌍 Africa
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none", border: "none",
            color: "#9CA3AF", cursor: "pointer", padding: "4px"
          }}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: "12px",
        display: "flex", flexDirection: "column",
        gap: "2px", overflowY: "auto"
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.2s ease",
                background: isActive
                  ? `linear-gradient(135deg, ${item.color}25, ${item.color}10)`
                  : "transparent",
                borderLeft: isActive
                  ? `3px solid ${item.color}`
                  : "3px solid transparent",
              }}
            >
              <Icon size={18} color={isActive ? item.color : "#6B7280"} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{
                  fontSize: "12px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? item.color : "#9CA3AF",
                  whiteSpace: "nowrap"
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: "12px" }}>
          <div style={{
            background: "linear-gradient(135deg, #6C63FF15, #FF658415)",
            border: "1px solid #6C63FF30",
            borderRadius: "12px",
            padding: "10px",
            textAlign: "center"
          }}>
            <p style={{ color: "white", fontSize: "10px", fontWeight: "600" }}>
              🌍 Built for Africa
            </p>
            <p style={{ color: "#6B7280", fontSize: "9px", marginTop: "2px" }}>
              Powered by Groq LLaMA 3.3
            </p>
          </div>
        </div>
      )}
    </div>
  );
}