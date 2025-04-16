import React from "react";

export default function ExportButton({ onClick }) {
  return (
    <button
      className="glass-card rounded-full shadow-lg px-5 py-3 text-lg font-bold flex items-center gap-2"
      style={{ background: "rgba(59,130,246,0.18)", backdropFilter: "blur(8px)", transition: "none" }}
      onClick={onClick}
    >
      <span role="img" aria-label="Export">📋</span> Export
    </button>
  );
}
