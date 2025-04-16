import { useState, useEffect } from "react";

export default function BuyInModal({ open, onClose, onSubmit, type }) {
  const [value, setValue] = useState(1000);
  useEffect(() => { setValue(1000); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="glass-card-strong p-6 shadow-xl w-80 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white mb-2">{type === "chips" ? "Buy-in Chips" : "Buy-in (₹)"}</h3>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="glass-input w-full text-lg text-center appearance-none hide-number-arrows"
          value={value.toLocaleString()}
          onChange={e => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            setValue(raw ? Number(raw) : "");
          }}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={() => { onSubmit(value); }}
          >OK</button>
          <button
            className="flex-1 bg-gray-700 text-gray-200 px-3 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}
