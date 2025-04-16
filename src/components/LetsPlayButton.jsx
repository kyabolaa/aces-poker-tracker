// Button to transition to the live game dashboard
export default function LetsPlayButton({ onClick }) {
  return (
    <button
      className="w-full py-3 rounded-lg text-lg font-bold transition shadow-lg border-2 border-blue-300 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-900 text-slate-900 hover:from-gray-400 hover:to-gray-700 hover:border-cyan-400 tracking-wider futuristic-steel"
      style={{
        boxShadow: '0 4px 16px 0 rgba(80,180,255,0.12)',
        letterSpacing: '0.05em',
        textShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }}
      onClick={onClick}
    >
      Let's play
    </button>
  );
}
