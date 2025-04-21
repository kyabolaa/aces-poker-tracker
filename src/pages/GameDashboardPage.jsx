import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameDashboardPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [chipCounts, setChipCounts] = useState({});
  const [activeIdx, setActiveIdx] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalValue, setModalValue] = useState(0);
  // Add Player modal state
  const [addPlayerName, setAddPlayerName] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  useEffect(() => {
    // Load players from localStorage (latest game)
    const stored = localStorage.getItem("aces_players");
    const playerList = stored ? JSON.parse(stored) : [];
    setPlayers(playerList);
    // Default chips (can be loaded from game config if needed)
    const chipObj = {};
    playerList.forEach(p => { chipObj[p.name] = 1; });
    setChipCounts(chipObj);
  }, []);

  function openModal(idx, type) {
    setActiveIdx(idx);
    setModalType(type);
    setModalValue(0);
  }
  function closeModal() {
    setActiveIdx(null);
    setModalType(null);
    setModalValue(0);
  }
  function handleChips(amount) {
    if (!players[activeIdx]) return;
    const name = players[activeIdx].name;
    setChipCounts(prev => ({ ...prev, [name]: Math.max(0, (prev[name] || 0) + amount) }));
    closeModal();
  }
  function handlePlayerLeft() {
    if (!players[activeIdx]) return;
    const name = players[activeIdx].name;
    setPlayers(players.filter((p, i) => i !== activeIdx));
    setChipCounts(prev => { const cp = { ...prev }; delete cp[name]; return cp; });
    closeModal();
  }
  function handleEndGame() {
    // Freeze current players (with buyInCount) for settlement
    // Guarantee we freeze correct buyInCount for each player
    const frozenPlayers = players.map(p => ({ name: p.name, buyInCount: p.buyInCount || 1 }));
    localStorage.setItem('aces_final_players', JSON.stringify(frozenPlayers));
    navigate("/settlement");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col items-center justify-start p-4 glass-card">
      <div className="w-full max-w-xl p-7 mt-10">
        <div className="flex items-center mb-4">
  <button className="back-btn mr-2" onClick={() => navigate(-1)} aria-label="Back">
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
  <h2 className="text-xl font-bold flex-1 text-center">
    {localStorage.getItem('aces_game_name') || 'Game'}
  </h2>
  {/* Only one Add Player button, no overlays */}
  <button
    className="flex items-center justify-center ml-2 rounded-lg bg-black hover:bg-gray-800 transition-colors"
    style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, padding: 0, boxShadow: 'none', border: 'none' }}
    title="Add Player"
    aria-label="Add Player"
    onClick={() => setShowAddPlayer(true)}
  >
    {/* Single blue-stroke SVG, no fill, no overlay */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="5" />
      <path d="M4 20c0-2.5 4-4 8-4s8 1.5 8 4" />
      <line x1="22" y1="5" x2="22" y2="11" />
      <line x1="19" y1="8" x2="25" y2="8" />
    </svg>
  </button>
</div>
        <div className="flex flex-col gap-3">
          {players.length === 0 && <div className="text-gray-400 text-center">No players found.</div>}
          {players.map((p, idx) => (
            <div key={p.name} className="flex items-center bg-white bg-opacity-10 rounded-xl px-3 py-2 shadow glass-row">
              {/* Player name: 2/3 width */}
              <span className="font-medium text-gray-100 text-base text-left flex-shrink-0" style={{ flexBasis: '66%', maxWidth: '66%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              {/* Chip controls: 1/3 width */}
              <div className="flex items-center gap-2 justify-end flex-shrink-0" style={{ flexBasis: '34%', maxWidth: '34%' }}>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white text-xl font-bold shadow hover:bg-white hover:bg-opacity-30"
                  onClick={() => {
                    // Decrement buyInCount (min 1)
                    setPlayers(prevPlayers => {
                      const updated = prevPlayers.map(player =>
                        player.name === p.name ? { ...player, buyInCount: Math.max(1, (player.buyInCount || 1) - 1) } : player
                      );
                      localStorage.setItem("aces_players", JSON.stringify(updated));
                      return updated;
                    });
                  }}
                  aria-label="Remove 1"
                >-</button>
                <span className="font-bold text-lg tabular-nums w-8 text-center">{p.buyInCount || 1}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white text-xl font-bold shadow hover:bg-white hover:bg-opacity-30"
                  onClick={() => {
                    // Increment buyInCount
                    setPlayers(prevPlayers => {
                      const updated = prevPlayers.map(player =>
                        player.name === p.name ? { ...player, buyInCount: (player.buyInCount || 1) + 1 } : player
                      );
                      localStorage.setItem("aces_players", JSON.stringify(updated));
                      return updated;
                    });
                  }}
                  aria-label="Add 1"
                >+</button>
              </div>
            </div>
          ))}
          {/* Floating Player Left Button */}
          {/* Floating Player Left Button (below last row, bottom-left) */}
          <button
            className="absolute z-40 w-14 h-14 rounded-full glass-row flex items-center justify-center text-white font-semibold text-xs shadow-lg"
            style={{ left: -40, top: 116 + (players.length * 56) + 112 }}
            onClick={() => setModalType('left')}
          >
            <span className="text-xs font-semibold">Player Left</span>
          </button>

          {/* Floating End Game Button (below last row, bottom-right) */}
          <button
            className="absolute z-40 w-14 h-14 rounded-full glass-row flex items-center justify-center text-white font-semibold text-xs shadow-lg"
            style={{ right: -40, top: 116 + (players.length * 56) + 112 }}
            onClick={handleEndGame}
          >
            <span className="text-xs font-semibold">End Game</span>
          </button>


          {/* Player Left Modal (no confirmation, just direct flow) */}
          {modalType === 'left' && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center" onClick={closeModal}>
              <div className="glass-modal p-6 w-80 flex flex-col gap-4 shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-2">Player Left</h3>
                <label className="text-gray-200 mb-1">Select Player</label>
                <select
                  className="w-full p-2 rounded bg-gray-900 text-gray-100 text-base"
                  value={activeIdx ?? ''}
                  onChange={e => setActiveIdx(Number(e.target.value))}
                >
                  <option value='' disabled>Select player</option>
                  {players.map((p, idx) => (
                    <option key={p.name} value={idx}>{p.name}</option>
                  ))}
                </select>
                <label className="text-gray-200 mb-1">Chip Count</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full p-2 rounded bg-gray-900 text-gray-100 text-lg text-center appearance-none hide-number-arrows"
                  value={modalValue.toLocaleString()}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setModalValue(raw ? Number(raw) : "");
                  }}
                  placeholder="Chips before leaving"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      if (activeIdx == null || activeIdx === '') return;
                      // Mark player as left (future: store chip count for settlement)
                      // Optionally, set a 'left' flag or update chip count, but do NOT remove from players or chipCounts
                      closeModal();
                    }}
                    disabled={activeIdx == null || activeIdx === ''}
                  >Confirm</button>
                  <button
                    className="flex-1 bg-gray-700 text-gray-200 px-3 py-2 rounded hover:bg-gray-600"
                    onClick={closeModal}
                  >Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Player Modal (dashboard) */}
          {showAddPlayer && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center" onClick={() => setShowAddPlayer(false)}>
              <div className="glass-modal p-6 w-80 flex flex-col gap-4 shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-2">Add Player</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={12}
                    className="flex-1 p-2 rounded bg-gray-900 text-gray-100 text-base"
                    placeholder="Player name"
                    value={addPlayerName}
                    onChange={e => setAddPlayerName(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 font-semibold"
                    disabled={!addPlayerName.trim() || players.some(p => p.name.toLowerCase() === addPlayerName.trim().toLowerCase())}
                    onClick={() => {
                      const name = addPlayerName.trim();
                      if (!name || players.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
                      const newPlayer = { name, buyInCount: 1 };
                      const updatedPlayers = [...players, newPlayer];
                      setPlayers(updatedPlayers);
                      setChipCounts(prev => ({ ...prev, [name]: 1 }));
                      localStorage.setItem("aces_players", JSON.stringify(updatedPlayers));
                      setAddPlayerName("");
                      setShowAddPlayer(false);
                    }}
                  >Add Player</button>
                </div>
                {addPlayerName && players.some(p => p.name.toLowerCase() === addPlayerName.trim().toLowerCase()) && (
                  <div className="text-red-400 text-xs mt-1">Name already exists</div>
                )}
                <button
                  className="mt-2 bg-gray-700 text-gray-200 px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setShowAddPlayer(false)}
                >Cancel</button>
              </div>
            </div>
          )}


        </div>
      </div>
      {/* Modal */}


    </div>
  );
}
