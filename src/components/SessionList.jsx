import { useState } from "react";
import SessionCard from './SessionCard';
// Displays a list of SessionCard components

export default function SessionList({ sessions = [] }) {
  const [sessionList, setSessionList] = useState(sessions);

  function handleDelete(id) {
    const updated = sessionList.filter(s => s.id !== id);
    setSessionList(updated);
    // Remove from localStorage as well
    const raw = localStorage.getItem('aces_game_history');
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        arr.splice(id - 1, 1); // id is 1-based index
        localStorage.setItem('aces_game_history', JSON.stringify(arr));
      } catch {}
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {sessionList.map(session => (
        <SessionCard key={session.id} session={session} onDelete={handleDelete} />
      ))}
    </div>
  );
}
