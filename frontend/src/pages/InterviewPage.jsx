import { useState } from "react";
import axios from "axios";
import { Mic, ChevronRight, Star, CheckCircle } from "lucide-react";

const EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead", "Manager"];
const CATEGORY_COLORS = {
  "Technical": "bg-blue-900 text-blue-300 border-blue-700",
  "Behavioral": "bg-purple-900 text-purple-300 border-purple-700",
  "Situational": "bg-orange-900 text-orange-300 border-orange-700",
};

export default function InterviewPage() {
  const [step, setStep] = useState("setup");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("Mid-level");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!jobTitle) return alert("Please enter a job title");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/interview/generate", {
        job_title: jobTitle, experience
      });
      setQuestions(res.data.questions);
      setStep("interview");
    } catch (e) {
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return alert("Please write your answer first");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/interview/score", {
        question: questions[currentQ].question,
        answer,
        job_title: jobTitle
      });
      setScores(prev => ({ ...prev, [currentQ]: res.data }));
      setStep("feedback");
    } catch (e) {
      alert("Failed to score answer");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setAnswer("");
      setStep("interview");
    } else {
      setStep("complete");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mic className="text-green-400" size={24} />
          Interview Coach
        </h1>
        <p className="text-gray-400 text-sm mt-1">Practice interviews with AI feedback</p>
      </div>

      {/* Setup */}
      {step === "setup" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-slide-up">
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">Job Title</label>
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager..."
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">Experience Level</label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    experience === level
                      ? "bg-green-500 text-white"
                      : "bg-dark border border-border text-gray-400 hover:border-green-400"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={generateQuestions}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Generating Questions..." : (
              <><Mic size={18} /> Start Interview Practice</>
            )}
          </button>
        </div>
      )}

      {/* Interview Question */}
      {step === "interview" && questions[currentQ] && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className={`text-xs px-3 py-1 rounded-full border ${CATEGORY_COLORS[questions[currentQ].category] || "bg-gray-800 text-gray-300 border-gray-600"}`}>
              {questions[currentQ].category}
            </span>
            <span className="text-gray-400 text-sm">
              Question {currentQ + 1} of {questions.length}
            </span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-white text-lg font-medium leading-relaxed">
              {questions[currentQ].question}
            </p>
            <p className="text-gray-500 text-xs mt-3">
              💡 Tip: {questions[currentQ].tips}
            </p>
          </div>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-green-400 transition-colors resize-none"
          />

          <button
            onClick={submitAnswer}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {loading ? "AI is scoring your answer..." : "Submit Answer for Feedback"}
          </button>
        </div>
      )}

      {/* Feedback */}
      {step === "feedback" && scores[currentQ] && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Your Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(scores[currentQ].score)}`}>
              {scores[currentQ].score}
            </p>
            <p className="text-gray-400 mt-1">{scores[currentQ].grade}</p>
          </div>

          <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
            <h3 className="text-green-400 font-bold mb-2">✅ What You Did Well</h3>
            <p className="text-gray-300 text-sm">{scores[currentQ].what_was_good}</p>
          </div>

          <div className="bg-yellow-950 border border-yellow-800 rounded-2xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">⚡ What to Improve</h3>
            <p className="text-gray-300 text-sm">{scores[currentQ].what_to_improve}</p>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5">
            <h3 className="text-primary font-bold mb-2">✨ Stronger Answer</h3>
            <p className="text-gray-300 text-sm italic">"{scores[currentQ].better_answer}"</p>
          </div>

          <button
            onClick={nextQuestion}
            className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {currentQ < questions.length - 1 ? (
              <><ChevronRight size={18} /> Next Question</>
            ) : (
              <><Star size={18} /> Complete Session</>
            )}
          </button>
        </div>
      )}

      {/* Complete */}
      {step === "complete" && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center animate-slide-up">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white text-2xl font-bold mb-2">Interview Complete!</h2>
          <p className="text-gray-400 mb-4">
            Average Score: {" "}
            <span className="text-green-400 font-bold text-xl">
              {Math.round(Object.values(scores).reduce((a, b) => a + b.score, 0) / Object.keys(scores).length)}
            </span>
          </p>
          <button
            onClick={() => { setStep("setup"); setQuestions([]); setScores({}); setCurrentQ(0); }}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
}