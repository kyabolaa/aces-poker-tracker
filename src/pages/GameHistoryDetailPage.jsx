import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GameHistoryDetailPage() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("aces_game_history");
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        // gameId is 1-based index as used in SessionList
        const idx = Number(gameId) - 1;
        if (arr[idx]) setGame(arr[idx]);
      } catch {}
    }
  }, [gameId]);

  if (!game) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="glass-card p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <button className="absolute left-4 top-4 text-blue-300 text-lg font-bold" onClick={() => navigate(-1)}>&larr; Back</button>
        <div className="text-gray-300 mt-10">Game not found.</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="glass-card p-8 rounded-2xl shadow-xl w-full max-w-lg relative mt-10">
        <button className="absolute left-4 top-6 text-blue-300 p-0 m-0" style={{ background: 'none', border: 'none' }} onClick={() => navigate(-1)} aria-label="Back">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white text-center mt-2">Game on {new Date(game.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</h2>
        <table className="w-full text-left glass-table mb-2 mt-6">
          <thead>
            <tr>
              <th className="py-2 px-2 text-gray-400">Player</th>
              <th className="py-2 px-2 text-gray-400">Buy-in</th>
              <th className="py-2 px-2 text-gray-400">Win/Loss</th>
            </tr>
          </thead>
          <tbody>
            {game.players.map((p, idx) => (
              <tr key={p.name} className="border-b border-gray-800">
                <td className="py-2 px-2 font-semibold text-white">{p.name}</td>
                <td className="py-2 px-2 text-blue-300">{p.buyInCount || 1}</td>
                <td className={`py-2 px-2 font-bold ${p.winLoss > 0 ? 'text-green-400' : p.winLoss < 0 ? 'text-red-400' : 'text-yellow-300'}`}>
                  {p.winLoss > 0 ? '+' : ''}{(p.winLoss / 1000).toFixed(1)}k
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
