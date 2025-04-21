import { useState } from "react";

export default function PlayerAddForm({ onAddPlayer, suggestions }) {
  const [name, setName] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  function handleAdd() {
    if (!name.trim()) return;
    // Check for duplicate name (case-insensitive)
    if (suggestions.some(n => n.toLowerCase() === name.trim().toLowerCase())) return;
    // Capitalize first letter
    const formatted = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
    onAddPlayer({ name: formatted });
    setName("");
  }

  function handleSuggest(n) {
    setName(n);
    setShowSuggest(false);
  }

  return (
    <div>
      <label>Add Player</label>
      <div className="flex gap-2 mb-2 items-center">
        <div className="flex-1 relative">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input
              className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-base placeholder-gray-400"
              placeholder="Enter player name..."
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setShowSuggest(false)}
              onBlur={() => setShowSuggest(false)}
            />
          </div>
        </div>
        <button
          className="glass-btn"
          onClick={handleAdd}
        >
          Next
        </button>
      </div>

    </div>
  );
}
