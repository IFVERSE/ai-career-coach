import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import CVPage from "./pages/CVPage";
import InterviewPage from "./pages/InterviewPage";
import SalaryPage from "./pages/SalaryPage";
import RoadmapPage from "./pages/RoadmapPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import JobMatchPage from "./pages/JobMatchPage";
import SkillsGapPage from "./pages/SkillsGapPage";
import LinkedInPage from "./pages/LinkedInPage";
import JobBoardPage from "./pages/JobBoardPage";

const PAGES = {
  dashboard: DashboardPage,
  chat: ChatPage,
  cv: CVPage,
  interview: InterviewPage,
  salary: SalaryPage,
  roadmap: RoadmapPage,
  coverletter: CoverLetterPage,
  jobmatch: JobMatchPage,
  skillsgap: SkillsGapPage,
  linkedin: LinkedInPage,
  jobboard: JobBoardPage,
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const PageComponent = PAGES[activePage];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      backgroundColor: "#0F0F1A",
      color: "white",
      overflow: "hidden"
    }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <PageComponent setActivePage={setActivePage} />
      </main>
    </div>
  );
}