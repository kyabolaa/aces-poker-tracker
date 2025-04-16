// Displays a single session summary card
export default function SessionCard({ session }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow-md">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">{session.gameName}</span>
        <span className="text-sm text-gray-400">{session.date}</span>
      </div>
      <div className="flex gap-4 text-sm">
        {session.topWinners.map((winner, i) => (
          <span key={i} className={i === 0 ? "text-green-400" : "text-yellow-400"}>
            {winner.name} {winner.amount > 0 ? "+" : ""}{winner.amount}k
          </span>
        ))}
      </div>
    </div>
  );
}
