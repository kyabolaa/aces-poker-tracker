import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoryPage from "./pages/HistoryPage";
import GameHistoryDetailPage from "./pages/GameHistoryDetailPage";
import GameSetupPage from "./pages/GameSetupPage";
import GameDashboardPage from "./pages/GameDashboardPage";
import SettlementPage from "./pages/SettlementPage";

export default function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-xs min-h-screen bg-gray-950 shadow-xl flex flex-col">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HistoryPage />} />
            <Route path="/history/:gameId" element={<GameHistoryDetailPage />} />
            <Route path="/setup" element={<GameSetupPage />} />
            <Route path="/dashboard" element={<GameDashboardPage />} />
            <Route path="/settlement" element={<SettlementPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
