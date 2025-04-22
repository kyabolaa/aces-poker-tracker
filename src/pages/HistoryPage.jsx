import SessionList from '../components/SessionList';
import GameHistoryDetailPage from './GameHistoryDetailPage';
import NewGameButton from '../components/NewGameButton';

function getSessionsFromLocalStorage() {
  const raw = localStorage.getItem('aces_game_history');
  if (!raw) return [];
  try {
    const history = JSON.parse(raw);
    // Convert to session card format
    return history.map((game, idx) => {
      // Format the date for display
      const dateObj = new Date(game.date);
      const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      // Top 2 winners (by winLoss descending)
      const sorted = [...game.players].sort((a, b) => b.winLoss - a.winLoss);
      return {
        id: idx + 1,
        gameName: `Game on ${dateStr}`,
        date: dateStr,
        topWinners: sorted.slice(0, 2).map(w => ({ name: w.name, amount: (w.winLoss / 1000).toFixed(1) }))
      };
    });
  } catch {
    return [];
  }
}

export default function HistoryPage() {
  const sessions = getSessionsFromLocalStorage();
  return (
    <div className="glass-card-strong p-6 shadow-xl w-80 mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide glass-btn">Aces</h1>
        <NewGameButton className="glass-btn" />
      </header>
      <SessionList sessions={sessions} />
    </div>
  );
}
