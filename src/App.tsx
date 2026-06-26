import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/models/:slug" element={<ModelDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
