import { useState, useRef, useEffect } from "react";

function formatAmount(val) {
  if (!val) return "";
  return Number(val).toLocaleString();
}

export default function FoodBillModal({ open, onClose, players, onSubmit }) {
  const [payer, setPayer] = useState(players?.[0]?.name || "");
  const [amount, setAmount] = useState("");

  // Reset payer and amount when modal opens
  useEffect(() => {
    if (open) {
      setPayer(players?.[0]?.name || "");
      setAmount("");
    }
  }, [open, players]);
  const inputRef = useRef(null);

  if (!open) return null;

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setAmount(raw);
    setTimeout(() => {
      if (inputRef.current) {
        const formatted = raw ? Number(raw).toLocaleString() : "";
        const caret = e.target.selectionStart;
        const diff = formatted.length - e.target.value.length;
        let newPos = caret + diff;
        newPos = Math.max(0, Math.min(formatted.length, newPos));
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }

  function handleSave() {
    if (!payer || !amount) return;
    onSubmit({ payer, amount: Number(amount) });
    setAmount("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60">
      <div className="glass-card-strong p-6 shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Food Bill</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Who Paid?</label>
          <select
            className="glass-input w-full p-2 rounded"
            value={payer}
            onChange={e => setPayer(e.target.value)}
          >
            {players.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Food Bill Amount</label>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className="glass-input w-full text-center appearance-none"
            value={formatAmount(amount)}
            onChange={handleAmountChange}
            placeholder="Enter amount"
          />
        </div>
        <div className="mt-4 flex justify-between gap-3">
          <button className="glass-btn" onClick={onClose}>Cancel</button>
          <button className="glass-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

