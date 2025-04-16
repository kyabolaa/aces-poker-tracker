import SessionCard from './SessionCard';
// Displays a list of SessionCard components
export default function SessionList({ sessions = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
