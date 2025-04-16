import { useState, useEffect } from "react";
import PlayerAddForm from "../components/PlayerAddForm";
import BuyInModal from "../components/BuyInModal";
import LetsPlayButton from "../components/LetsPlayButton";
import { useNavigate } from "react-router-dom";

function getDefaultGameName() {
  const d = new Date();
  return `Game on ${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}




export default function GameSetupPage() {
  const navigate = useNavigate();
  // Format gameName as dd-mm-yy
  function getToday() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getFullYear()).slice(-2)}`;
  }
  const [gameName, setGameName] = useState(getToday());
  const [players, setPlayers] = useState(() => {
    try {
      const stored = localStorage.getItem("aces_players");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [buyInChips, setBuyInChips] = useState(() => {
    const stored = localStorage.getItem("aces_buy_in_chips");
    return stored ? Number(stored) : 20000;
  });
  const [buyInAmount, setBuyInAmount] = useState(() => {
    const stored = localStorage.getItem("aces_buy_in_amount");
    return stored ? Number(stored) : 10000;
  });
  const [showChipsModal, setShowChipsModal] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);

  function handleAddPlayer(player) {
    const updated = [...players, player];
    setPlayers(updated);
    localStorage.setItem("aces_players", JSON.stringify(updated));
  }
  function handleEditPlayer(idx, newPlayer) {
    setPlayers(players.map((p, i) => (i === idx ? newPlayer : p)));
  }
  function handleDeletePlayer(idx) {
    const updated = players.filter((_, i) => i !== idx);
    setPlayers(updated);
    localStorage.setItem("aces_players", JSON.stringify(updated));
  }
  function handleLetsPlay() {
    // Save buy-in chips and amount to localStorage for use in SettlementPage
    localStorage.setItem("aces_buy_in_chips", buyInChips);
    localStorage.setItem("aces_buy_in_amount", buyInAmount);
    navigate("/dashboard");
  }

  // Persist buy-in chips and amount whenever they change
  useEffect(() => {
    localStorage.setItem("aces_buy_in_chips", buyInChips);
  }, [buyInChips]);
  useEffect(() => {
    localStorage.setItem("aces_buy_in_amount", buyInAmount);
  }, [buyInAmount]);

  return (
    <div className="w-full max-w-xs mx-auto p-4 glass-card">
      <div className="flex items-center mb-4">
        <button className="glass-btn" onClick={() => navigate(-1)} aria-label="Back">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-xl font-bold">Create a new game</h2>
      </div>
      <label className="block mb-2 font-semibold text-gray-400">Game Name</label>
      <input
        className="glass-input w-full"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      />
      <div className="flex gap-2 mb-4">
        <button className="glass-btn flex-1" onClick={() => setShowChipsModal(true)}>
          <span className="block text-xs text-gray-400">Buy-in Chips</span>
          <span className="font-bold text-lg">{buyInChips.toLocaleString()}</span>
        </button>
        <button className="glass-btn flex-1" onClick={() => setShowAmountModal(true)}>
          <span className="block text-xs text-gray-400">Buy-in</span>
          <span className="font-bold text-lg">₹{buyInAmount.toLocaleString()}</span>
        </button>
      </div>
      <label className="block text-gray-400 mb-1">Add Player</label>
      <PlayerAddForm
        onAddPlayer={handleAddPlayer}
        suggestions={players.map((p) => p.name)}
      />
      {/* Player List: newest at top */}
      <div className="flex flex-col gap-2 mb-4">
        {players.slice().reverse().map((player, idx) => (
          <div key={player.name} className="glass-card-strong p-6 shadow-xl w-80">
            {player.name}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          className="glass-btn w-full mt-2 p-3 rounded text-white font-bold text-lg"
          onClick={handleLetsPlay}
        >
          Let's Play!
        </button>
      </div>
      <BuyInModal
        open={showChipsModal}
        onClose={() => setShowChipsModal(false)}
        onSubmit={(val) => {
          setBuyInChips(val); setShowChipsModal(false);
        }}
        type="chips"
      />
      <BuyInModal
        open={showAmountModal}
        onClose={() => setShowAmountModal(false)}
        onSubmit={(val) => {
          setBuyInAmount(val); setShowAmountModal(false);
        }}
        type="amount"
      />
    </div>
  );
}
