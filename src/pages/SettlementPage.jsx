import { useEffect, useState } from "react";
import FoodBillModal from "../components/FoodBillModal";
import ExportButton from "../components/ExportButton";
import { getSettlementExportText } from "./SettlementPage.export";

// Custom input for chip count with comma-formatting and cursor preservation
import { useRef } from "react";

function ChipInput({ value, onChange }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    // Calculate caret position before formatting
    const prevLen = e.target.value.length;
    const caret = e.target.selectionStart;
    onChange(raw ? Number(raw) : "");
    setTimeout(() => {
      if (inputRef.current) {
        // Calculate new caret position after formatting
        const formatted = raw ? Number(raw).toLocaleString() : "";
        const nextLen = formatted.length;
        const diff = nextLen - prevLen;
        let newPos = caret + diff;
        // Clamp position
        newPos = Math.max(0, Math.min(formatted.length, newPos));
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      className="glass-input w-24 text-center appearance-none"
      value={value !== undefined && value !== null && value !== '' ? Number(value).toLocaleString() : ''}
      onChange={handleChange}
      placeholder=" "
    />
  );
}

export default function SettlementPage() {
  const [exportCopied, setExportCopied] = useState(false);

  function handleExport() {
    const text = getSettlementExportText({
      players,
      winLoss,
      postFoodWinLoss,
      showPostFood,
      foodBill
    });
    navigator.clipboard.writeText(text).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    });
  }
  // Load players and buy-in info from localStorage
  const [players, setPlayers] = useState([]);

  const [initialChips, setInitialChips] = useState(1); // Default 1
  const [buyInAmount, setBuyInAmount] = useState(1); // Default 1
  const [finalChips, setFinalChips] = useState({});

  useEffect(() => {
    // Use frozen player list (with buyInCount) if available
    const storedFinalPlayers = localStorage.getItem("aces_final_players");
    let playerList;
    if (storedFinalPlayers) {
      let loaded = JSON.parse(storedFinalPlayers);
      // Patch: ensure every player has buyInCount
      playerList = loaded.map(p => ({ ...p, buyInCount: typeof p.buyInCount === 'number' ? p.buyInCount : 1 }));
    } else {
      const storedPlayers = localStorage.getItem("aces_players");
      playerList = storedPlayers ? JSON.parse(storedPlayers).map(p => ({ ...p, buyInCount: 1 })) : [];
    }
    setPlayers(playerList);
    // For now, assume buy-in count is always 1 for all

    // Load buy-in chips and buy-in amount from localStorage if available
    const chips = Number(localStorage.getItem("aces_buy_in_chips")) || 1;
    const amount = Number(localStorage.getItem("aces_buy_in_amount")) || 1;
    setInitialChips(chips);
    setBuyInAmount(amount);
    // Do not prefill final chip counts; leave blank for user input
    setFinalChips({});
  }, []);

  // Conversion Factor
  const conversionFactor = initialChips > 0 ? buyInAmount / initialChips : 0;

  // Debug: log players to verify buyInCount
  console.log("SettlementPage players:", players);

  // If any player is missing buyInCount, try to load from aces_final_players by name
  let buyInMap = {};
  try {
    const frozen = JSON.parse(localStorage.getItem("aces_final_players") || "[]");
    frozen.forEach(fp => { buyInMap[fp.name] = fp.buyInCount; });
  } catch (e) {}

  // Compute win/loss for each player
  const winLoss = players.map(p => {
    // Use frozen buyInCount if present, else fallback to player object, else warn
    let buyIns = p.buyInCount;
    if (typeof buyIns !== "number") buyIns = buyInMap[p.name];
    if (typeof buyIns !== "number") {
      console.warn(`Missing buyInCount for player ${p.name}, defaulting to 1`);
      buyIns = 1;
    }
    const final = finalChips[p.name] || 0;
    // Correct calculation: (Final Chip Count - (Initial Chip Count * Buy-In Count)) * Conversion Factor
    const wl = Math.round((final - (initialChips * buyIns)) * conversionFactor);
    return { name: p.name, value: wl };
  });

  const auditSum = winLoss.reduce((acc, p) => acc + p.value, 0);

  // Food bill modal state
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [foodBill, setFoodBill] = useState(null); // { payer, amount }
  const [frozenWinLoss, setFrozenWinLoss] = useState(null);

  // When opening the Food Bill modal, freeze win/loss
  function handleOpenFoodModal() {
    const snapshot = winLoss.map(w => ({ ...w }));
    setFrozenWinLoss(snapshot);
    localStorage.setItem("aces_frozen_winloss", JSON.stringify(snapshot));
    setFoodModalOpen(true);
  }

  // Toggle for food settlement
  const [showPostFood, setShowPostFood] = useState(false);

  // Calculate post-food win/loss if foodBill is present
  // Use frozen win/loss for food bill logic if available
  let postFoodWinLoss = winLoss;
  const baseWinLoss = frozenWinLoss || winLoss;
  if (foodBill && showPostFood && baseWinLoss) {
    // Winners (positive win/loss)
    const winners = baseWinLoss.filter(wl => wl.value > 0);
    const totalWinnings = winners.reduce((acc, w) => acc + w.value, 0);
    if (totalWinnings > 0 && winners.length > 0) {
      // Calculate share for each winner
      const foodShares = winners.map(w => ({
        name: w.name,
        share: Math.round(foodBill.amount * (w.value / totalWinnings))
      }));
      // Map for quick lookup
      const shareMap = Object.fromEntries(foodShares.map(f => [f.name, f.share]));
      postFoodWinLoss = baseWinLoss.map(wl => {
        if (wl.name === foodBill.payer && wl.value > 0) {
          // payer is a winner: win/loss - share + full bill paid
          return { ...wl, value: wl.value - (shareMap[wl.name] || 0) + foodBill.amount };
        } else if (wl.value > 0) {
          // winner (not payer): win/loss - share
          return { ...wl, value: wl.value - (shareMap[wl.name] || 0) };
        } else if (wl.name === foodBill.payer) {
          // payer, not a winner: just add the full bill paid
          return { ...wl, value: wl.value + foodBill.amount };
        } else {
          // others: unchanged
          return wl;
        }
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 flex flex-col items-center justify-start">
      <div className="flex items-center mb-4 w-full max-w-md">
        <button className="mr-2 p-1 rounded hover:bg-gray-800 focus:outline-none" onClick={() => window.history.back()} aria-label="Back">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center">Settlement</h2>
      </div>
        {foodBill && (
      <div className="w-full max-w-md flex flex-col items-center mb-3">
        <div className="mb-1 text-sm text-gray-300">Food Bill: <span className="font-bold text-white">₹{foodBill.amount.toLocaleString()}</span> paid by <span className="font-bold text-white">{foodBill.payer}</span></div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">Settlement:</span>
          <div className="relative">
            <div className="flex transition-all duration-300 ease-in-out">
              <button
                className={`px-3 py-1 rounded-l-lg transition-all duration-300 ${!showPostFood ? 'bg-green-600 text-white scale-105 shadow-md' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setShowPostFood(false)}
              >Pre-Food</button>
              <button
                className={`px-3 py-1 rounded-r-lg transition-all duration-300 ${showPostFood ? 'bg-green-600 text-white scale-105 shadow-md' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setShowPostFood(true)}
              >Post-Food</button>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Main box */}
      <div className="w-full max-w-md glass-card p-5">
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="py-2 text-left">Player</th>
              <th className="py-2 text-center">Final Chip Count</th>
              <th className="py-2 text-right pr-4">Win/Loss</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.name}>
                <td className="py-2 font-semibold text-left">{p.name}</td>
                <td className="py-2 text-center">
                  <ChipInput
                    value={finalChips[p.name] !== undefined && finalChips[p.name] !== null && finalChips[p.name] !== '' ? finalChips[p.name] : ''}
                    onChange={val => setFinalChips(fc => ({ ...fc, [p.name]: val }))}
                  />
                </td>
                <td className="py-2 font-bold text-right pr-4">
                  {(showPostFood && foodBill
                    ? postFoodWinLoss.find(wl => wl.name === p.name)?.value
                    : winLoss.find(wl => wl.name === p.name)?.value
                  )?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="py-2 font-bold text-right">Audit:</td>
              <td className={auditSum === 0 ? "py-2 font-bold text-green-400 text-right pr-4" : "py-2 font-bold text-red-400 text-right pr-4"}>
                {(showPostFood && foodBill
                  ? postFoodWinLoss.reduce((acc, p) => acc + p.value, 0)
                  : auditSum
                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
            </tr>
          </tfoot>
        </table>
        {/* Food Bill & Export Buttons below the box, mobile-friendly (ONLY ONCE) */}
        <div className="w-full flex justify-between mt-3 mb-2 gap-2">
          <div>
            <ExportButton onClick={handleExport} />
            {exportCopied && <span className="ml-3 text-green-400 font-bold">Copied!</span>}
          </div>
          <button
            className="glass-btn flex items-center gap-2"
            style={{ background: "rgba(34,197,94,0.18)", backdropFilter: "blur(8px)", transition: "none" }}
            onClick={handleOpenFoodModal}
          >
            <span role="img" aria-label="Food">🍽</span> Food Bill
          </button>
        </div>
      </div>
      <FoodBillModal
        open={foodModalOpen}
        onClose={() => setFoodModalOpen(false)}
        players={players}
        onSubmit={fb => setFoodBill(fb)}
      />
    </div>
  );
}
