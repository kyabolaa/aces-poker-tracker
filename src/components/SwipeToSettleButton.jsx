import React, { useRef, useState } from "react";

/**
 * SwipeToSettleButton
 * A swipe-to-confirm button to prevent accidental "Settled!" actions.
 * Usage: <SwipeToSettleButton onSettle={handleSettled} />
 */
export default function SwipeToSettleButton({ onSettle }) {
  const [dragX, setDragX] = useState(0);
  const [settled, setSettled] = useState(false);
  const startX = useRef(null);
  const buttonRef = useRef(null);

  const maxDrag = 240; // px, must match width in style
  const threshold = 0.65; // % of width to trigger settle

  function handleTouchStart(e) {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  }
  function handleTouchMove(e) {
    if (startX.current == null) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let dx = clientX - startX.current;
    dx = Math.max(0, Math.min(dx, maxDrag));
    setDragX(dx);
  }
  function handleTouchEnd() {
    if (dragX > maxDrag * threshold) {
      setSettled(true);
      setTimeout(() => {
        setDragX(0);
        setSettled(false);
        onSettle();
      }, 350);
    } else {
      setDragX(0);
    }
    startX.current = null;
  }

  return (
    <div
      ref={buttonRef}
      className="relative select-none w-[260px] h-[48px] mx-auto mt-2 mb-2"
      style={{ userSelect: "none", touchAction: "pan-x" }}
    >
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, #232b3a 0%, #2e466e 100%)",
          boxShadow: "0 6px 32px 0 rgba(46, 70, 110, 0.17)",
          opacity: settled ? 0.7 : 1,
          transition: "opacity 0.3s"
        }}
      />
      <div
        className="absolute left-0 top-0 h-full flex items-center w-full"
        style={{
          color: dragX > maxDrag * threshold ? "#b5f7c5" : "#d0e6fa",
          fontWeight: 700,
          fontSize: "1.19rem",
          letterSpacing: "0.04em",
          zIndex: 1,
          userSelect: "none",
          justifyContent: 'center',
          width: '100%'
        }}
      >
        {settled ? "Settled!" : "Swipe to Settle"}
      </div>
      <div
        className="absolute top-1 left-1 h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg cursor-pointer flex items-center justify-center"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: settled ? "transform 0.3s" : "",
          zIndex: 2,
          touchAction: "none"
        }}
        onMouseDown={handleTouchStart}
        onMouseMove={e => startX.current !== null && handleTouchMove(e)}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <span className="text-white text-xl font-bold">→</span>
      </div>
    </div>
  );
}
