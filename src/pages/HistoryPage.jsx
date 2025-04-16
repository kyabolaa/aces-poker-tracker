import SessionList from '../components/SessionList';
import NewGameButton from '../components/NewGameButton';

const mockSessions = [
  {
    id: 1,
    gameName: 'Game on 2025-04-01',
    date: 'Apr 1, 2025',
    topWinners: [
      { name: 'Kabir', amount: 4.3 },
      { name: 'Rohit', amount: 2.1 }
    ]
  },
  // Add more mock sessions here if needed
];

export default function HistoryPage() {
  return (
    <div className="glass-card-strong p-6 shadow-xl w-80 mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide glass-btn">Aces</h1>
        <NewGameButton className="glass-btn" />
      </header>
      <SessionList sessions={mockSessions} />
    </div>
  );
}
