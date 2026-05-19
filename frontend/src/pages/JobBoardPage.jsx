import { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase, Search, ExternalLink,
  Target, CheckCircle, XCircle,
  RefreshCw, Filter, Zap, MapPin,
  DollarSign, Calendar, Star
} from "lucide-react";

const CATEGORIES = [
  { value: "software-dev",      label: "💻 Software Dev"    },
  { value: "devops",            label: "⚙️ DevOps"          },
  { value: "data",              label: "📊 Data Science"    },
  { value: "design",            label: "🎨 Design"          },
  { value: "product",           label: "📦 Product"         },
  { value: "marketing",         label: "📣 Marketing"       },
  { value: "customer-support",  label: "🎧 Support"         },
  { value: "writing",           label: "✍️ Writing"         },
];

const MATCH_COLORS = {
  "Perfect Match":  { bg: "#34D39920", border: "#34D39960", text: "#34D399", bar: "#34D399" },
  "Strong Match":   { bg: "#60A5FA20", border: "#60A5FA60", text: "#60A5FA", bar: "#60A5FA" },
  "Good Match":     { bg: "#A855F720", border: "#A855F760", text: "#A855F7", bar: "#A855F7" },
  "Partial Match":  { bg: "#FBBF2420", border: "#FBBF2460", text: "#FBBF24", bar: "#FBBF24" },
  "Poor Match":     { bg: "#F4727220", border: "#F4727260", text: "#F47272", bar: "#F47272" },
};

export default function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("software-dev");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [userProfile, setUserProfile] = useState("");
  const [fitResult, setFitResult] = useState(null);
  const [fitLoading, setFitLoading] = useState(false);
  const [showFitPanel, setShowFitPanel] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [category]);

  const fetchJobs = async () => {
    setLoading(true);
    setSelectedJob(null);
    setFitResult(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/jobs?category=${category}`);
      setJobs(res.data.jobs);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const analyzefit = async () => {
    if (!selectedJob) return alert("Please select a job first");
    if (!userProfile.trim()) return alert("Please enter your profile/skills");
    setFitLoading(true);
    setFitResult(null);
    try {
      const res = await axios.post("http://localhost:8000/api/job-fit", {
        job_title: selectedJob.title,
        job_description: selectedJob.description,
        user_profile: userProfile
      });
      setFitResult(res.data);
    } catch {
      alert("Analysis failed. Please try again.");
    } finally {
      setFitLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  const matchColors = fitResult
    ? (MATCH_COLORS[fitResult.match_level] || MATCH_COLORS["Partial Match"])
    : null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#0F0F1A" }}>

      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid #2A2A4A",
        background: "linear-gradient(135deg, #6C63FF10, #34D39910)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px",
              background: "linear-gradient(135deg, #6C63FF, #34D399)",
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Briefcase size={20} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: "20px", fontWeight: "700",
                background: "linear-gradient(135deg, #6C63FF, #34D399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Live Job Board
              </h1>
              <p style={{ color: "#6B7280", fontSize: "12px" }}>
                Real remote jobs • AI fit analysis • Updated daily
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "🧠 Mindrift", url: "https://mindrift.ai/" },
              { label: "💼 Crossover", url: "https://www.crossover.com/jobs" },
            ].map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{
                background: "#1A1A2E",
                border: "1px solid #2A2A4A",
                borderRadius: "8px",
                padding: "6px 12px",
                color: "#9CA3AF",
                fontSize: "12px",
                textDecoration: "none",
                display: "flex", alignItems: "center", gap: "4px",
                transition: "all 0.2s ease"
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#6C63FF";
                  e.currentTarget.style.color = "#A78BFA";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#2A2A4A";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                {link.label} <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{
          display: "flex", gap: "8px", marginTop: "16px",
          flexWrap: "wrap"
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              style={{
                background: category === cat.value
                  ? "linear-gradient(135deg, #6C63FF, #A855F7)"
                  : "#1A1A2E",
                border: `1px solid ${category === cat.value ? "transparent" : "#2A2A4A"}`,
                borderRadius: "999px",
                padding: "6px 14px",
                color: category === cat.value ? "white" : "#9CA3AF",
                fontSize: "12px",
                fontWeight: category === cat.value ? "600" : "400",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Job List */}
        <div style={{
          width: selectedJob ? "45%" : "100%",
          borderRight: selectedJob ? "1px solid #2A2A4A" : "none",
          display: "flex", flexDirection: "column",
          transition: "width 0.3s ease"
        }}>
          {/* Search */}
          <div style={{ padding: "16px", borderBottom: "1px solid #2A2A4A" }}>
            <div style={{
              display: "flex", gap: "8px",
              alignItems: "center",
              background: "#1A1A2E",
              border: "1px solid #2A2A4A",
              borderRadius: "10px",
              padding: "10px 14px"
            }}>
              <Search size={16} color="#6B7280" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs or companies..."
                style={{
                  flex: 1, background: "transparent",
                  border: "none", outline: "none",
                  color: "white", fontSize: "13px",
                  fontFamily: "inherit"
                }}
              />
              <button
                onClick={fetchJobs}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", color: "#6B7280"
                }}
              >
                <RefreshCw size={14} color={loading ? "#6C63FF" : "#6B7280"}
                  style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
                />
              </button>
            </div>
          </div>

          {/* Jobs */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "12px" }}>
                  {[0, 150, 300].map((delay, i) => (
                    <div key={i} style={{
                      width: "10px", height: "10px",
                      background: "#6C63FF", borderRadius: "50%",
                      animation: `bounce-dot 1s ease-in-out ${delay}ms infinite`
                    }} />
                  ))}
                </div>
                <p style={{ color: "#6B7280", fontSize: "13px" }}>
                  Loading live jobs...
                </p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontSize: "40px", marginBottom: "12px" }}>📭</p>
                <p style={{ color: "#6B7280" }}>No jobs found</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filteredJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      setFitResult(null);
                    }}
                    style={{
                      background: selectedJob?.id === job.id
                        ? "linear-gradient(135deg, #6C63FF15, #A855F715)"
                        : "#1A1A2E",
                      border: `1px solid ${selectedJob?.id === job.id ? "#6C63FF50" : "#2A2A4A"}`,
                      borderRadius: "14px",
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => {
                      if (selectedJob?.id !== job.id) {
                        e.currentTarget.style.borderColor = "#6C63FF30";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedJob?.id !== job.id) {
                        e.currentTarget.style.borderColor = "#2A2A4A";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    {/* Job Header */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px" }}>
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={job.company}
                          style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "contain", background: "white", padding: "2px" }}
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div style={{
                          width: "36px", height: "36px",
                          background: "linear-gradient(135deg, #6C63FF, #A855F7)",
                          borderRadius: "8px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px", fontWeight: "700", color: "white", flexShrink: 0
                        }}>
                          {job.company[0]}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: "white", fontWeight: "600",
                          fontSize: "13px", marginBottom: "2px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                          {job.title}
                        </p>
                        <p style={{ color: "#A78BFA", fontSize: "12px" }}>{job.company}</p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ color: "#6B7280", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={10} /> {job.location}
                      </span>
                      {job.salary && job.salary !== "Not specified" && (
                        <span style={{ color: "#FBBF24", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <DollarSign size={10} /> {job.salary.substring(0, 30)}
                        </span>
                      )}
                      <span style={{ color: "#6B7280", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={10} /> {job.posted}
                      </span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {job.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} style={{
                          background: "#6C63FF15",
                          border: "1px solid #6C63FF30",
                          borderRadius: "999px",
                          padding: "2px 8px",
                          fontSize: "10px",
                          color: "#A78BFA"
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Detail + Fit Analyzer */}
        {selectedJob && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            overflowY: "auto", padding: "20px",
            animation: "slideUp 0.3s ease-out"
          }}>
            {/* Job Detail */}
            <div style={{
              background: "#1A1A2E",
              border: "1px solid #2A2A4A",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
  <div>
    <h2 style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
      {selectedJob.title}
    </h2>

    <p style={{ color: "#A78BFA", fontSize: "13px" }}>
      {selectedJob.company}
    </p>
  </div>

  <a
    href={selectedJob.url}
    target="_blank"
    rel="noreferrer"
    style={{
      background: "linear-gradient(135deg, #6C63FF, #A855F7)",
      border: "none",
      borderRadius: "10px",
      padding: "8px 16px",
      color: "white",
      fontSize: "12px",
      fontWeight: "600",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexShrink: 0
    }}
  >
    Apply Now <ExternalLink size={12} />
  </a>
</div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ color: "#6B7280", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={12} color="#6B7280" /> {selectedJob.location}
                </span>
                {selectedJob.salary !== "Not specified" && (
                  <span style={{ color: "#FBBF24", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <DollarSign size={12} color="#FBBF24" /> {selectedJob.salary}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                {selectedJob.tags.map((tag, i) => (
                  <span key={i} style={{
                    background: "#6C63FF20",
                    border: "1px solid #6C63FF40",
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontSize: "11px", color: "#A78BFA"
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p style={{
                color: "#9CA3AF", fontSize: "12px",
                lineHeight: "1.7",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {selectedJob.description.replace(/<[^>]*>/g, "")}
              </p>
            </div>

            {/* Fit Analyzer */}
            <div style={{
              background: "#1A1A2E",
              border: "1px solid #2A2A4A",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px"
            }}>
              <h3 style={{
                color: "white", fontWeight: "700",
                fontSize: "14px", marginBottom: "12px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <Zap size={16} color="#FBBF24" />
                Am I a Good Fit?
              </h3>

              <textarea
                value={userProfile}
                onChange={e => setUserProfile(e.target.value)}
                placeholder="Describe your skills and experience e.g: I have 3 years experience in Python, React, and FastAPI. I've built 2 full-stack apps and I'm familiar with Docker and AWS..."
                rows={4}
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
                  lineHeight: "1.6",
                  marginBottom: "12px"
                }}
              />

              <button
                onClick={analyzefit}
                disabled={fitLoading}
                style={{
                  width: "100%",
                  background: fitLoading
                    ? "#2A2A4A"
                    : "linear-gradient(135deg, #FBBF24, #F59E0B)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  color: fitLoading ? "#6B7280" : "#0F0F1A",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: fitLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {fitLoading ? "🤖 Analyzing your fit..." : "⚡ Analyze My Fit For This Job"}
              </button>
            </div>

            {/* Fit Results */}
            {fitResult && matchColors && (
              <div style={{
                background: matchColors.bg,
                border: `1px solid ${matchColors.border}`,
                borderRadius: "16px",
                padding: "20px",
                animation: "slideUp 0.4s ease-out"
              }}>
                {/* Score */}
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <p style={{ color: "#6B7280", fontSize: "12px", marginBottom: "8px" }}>
                    Your Match Score
                  </p>
                  <p style={{
                    fontSize: "56px", fontWeight: "800",
                    color: matchColors.text, lineHeight: 1
                  }}>
                    {fitResult.match_score}
                  </p>
                  <p style={{ color: matchColors.text, fontWeight: "700", fontSize: "14px", marginTop: "4px" }}>
                    {fitResult.match_level}
                  </p>

                  {/* Score Bar */}
                  <div style={{
                    background: "#2A2A4A", borderRadius: "999px",
                    height: "8px", margin: "12px 0"
                  }}>
                    <div style={{
                      width: `${fitResult.match_score}%`,
                      background: `linear-gradient(90deg, ${matchColors.bar}, ${matchColors.bar}99)`,
                      height: "100%", borderRadius: "999px",
                      transition: "width 1s ease"
                    }} />
                  </div>

                  <p style={{ color: "#D1D5DB", fontSize: "13px", fontStyle: "italic" }}>
                    "{fitResult.verdict}"
                  </p>
                </div>

                {/* Matching Skills */}
                <div style={{ marginBottom: "12px" }}>
                  <p style={{
                    color: "#34D399", fontSize: "12px",
                    fontWeight: "700", marginBottom: "8px",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                    <CheckCircle size={14} /> Matching Skills
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {fitResult.matching_skills?.map((skill, i) => (
                      <span key={i} style={{
                        background: "#34D39920",
                        border: "1px solid #34D39940",
                        borderRadius: "999px",
                        padding: "3px 10px",
                        fontSize: "12px", color: "#34D399"
                      }}>
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div style={{ marginBottom: "12px" }}>
                  <p style={{
                    color: "#F47272", fontSize: "12px",
                    fontWeight: "700", marginBottom: "8px",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                    <XCircle size={14} /> Missing Skills
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {fitResult.missing_skills?.map((skill, i) => (
                      <span key={i} style={{
                        background: "#F4727220",
                        border: "1px solid #F4727240",
                        borderRadius: "999px",
                        padding: "3px 10px",
                        fontSize: "12px", color: "#F47272"
                      }}>
                        ✗ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{
                  background: "#0F0F1A",
                  border: "1px solid #2A2A4A",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "12px"
                }}>
                  <p style={{ color: "#FBBF24", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                    💡 Recommendation
                  </p>
                  <p style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.6" }}>
                    {fitResult.recommendation}
                  </p>
                </div>

                {/* Preparation Tips */}
                <div>
                  <p style={{
                    color: "#A78BFA", fontSize: "12px",
                    fontWeight: "700", marginBottom: "8px",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}>
                    <Star size={14} /> Preparation Tips
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {fitResult.preparation_tips?.map((tip, i) => (
                      <div key={i} style={{
                        display: "flex", gap: "10px", alignItems: "flex-start"
                      }}>
                        <span style={{
                          background: "linear-gradient(135deg, #6C63FF, #A855F7)",
                          borderRadius: "6px",
                          width: "20px", height: "20px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "10px", fontWeight: "700", color: "white",
                          flexShrink: 0
                        }}>
                          {i + 1}
                        </span>
                        <p style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.6" }}>
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    marginTop: "16px",
                    background: "linear-gradient(135deg, #6C63FF, #A855F7)",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "700",
                    textDecoration: "none",
                    textAlign: "center",
                    boxShadow: "0 8px 25px #6C63FF30"
                  }}
                >
                  🚀 Apply for This Job Now
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}