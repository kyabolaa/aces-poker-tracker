import { useState } from "react";

export default function PlayerAddForm({ onAddPlayer, suggestions }) {
  const [name, setName] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  function handleAdd() {
    if (!name.trim()) return;
    // Check for duplicate name (case-insensitive)
    if (suggestions.some(n => n.toLowerCase() === name.trim().toLowerCase())) return;
    onAddPlayer({ name: name.trim() });
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
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setShowSuggest(false)}
            onBlur={() => setShowSuggest(false)}
          />
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
