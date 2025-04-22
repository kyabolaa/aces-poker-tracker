// Displays a single session summary card
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionCard({ session, onDelete }) {
  const navigate = useNavigate();
  const [dragX, setDragX] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' or 'right'
  const deleteTimeout = useRef(null);
  const startX = useRef(null);
  const threshold = 60; // px to reveal delete

  function handleTouchStart(e) {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  }
  function handleTouchMove(e) {
    if (startX.current == null) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let dx = clientX - startX.current;
    setDragX(Math.max(Math.min(dx, 90), -90)); // allow both directions, clamp
  }
  function handleTouchEnd() {
    if (dragX < -threshold) {
      setSwipeDirection('left');
      setShowDelete(true);
      if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
      deleteTimeout.current = setTimeout(() => {
        setShowDelete(false);
      }, 1000);
    } else if (dragX > threshold) {
      setSwipeDirection('right');
      setShowDelete(true);
      if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
      deleteTimeout.current = setTimeout(() => {
        setShowDelete(false);
      }, 1000);
    } else {
      setShowDelete(false);
      setSwipeDirection(null);
    }
    // Do NOT reset dragX here; let the card stay pushed while delete is visible
    startX.current = null;
  }
  function handleDelete(e) {
    e.stopPropagation();
    setShowDelete(false);
    setSwipeDirection(null);
    setDragX(0);
    if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
    onDelete?.(session.id);
  }
  // Clean up timer if unmounting
  useEffect(() => {
    if (!showDelete) setDragX(0);
    if (!showDelete) setSwipeDirection(null);
  }, [showDelete]);
  useEffect(() => () => { if (deleteTimeout.current) clearTimeout(deleteTimeout.current); }, []);

  return (
    <div className="relative w-full">
      {/* Delete button revealed underneath */}
      {swipeDirection === 'left' && (
        <button
          className={`absolute right-0 top-0 h-full w-14 rounded-xl text-white font-bold text-2xl flex items-center justify-center transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{
            zIndex: 1,
            background: 'rgba(220, 60, 80, 0.22)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.13)',
            boxShadow: '0 6px 32px 0 rgba(180,40,60,0.10)',
            color: '#ffeaea',
            right: 0
          }}
          onClick={handleDelete}
          tabIndex={showDelete ? 0 : -1}
          aria-label="Delete session"
        >
          ×
        </button>
      )}
      {swipeDirection === 'right' && (
        <button
          className={`absolute left-0 top-0 h-full w-14 rounded-xl text-white font-bold text-2xl flex items-center justify-center transition-all duration-200 ${showDelete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{
            zIndex: 1,
            background: 'rgba(220, 60, 80, 0.22)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.13)',
            boxShadow: '0 6px 32px 0 rgba(180,40,60,0.10)',
            color: '#ffeaea',
            left: 0
          }}
          onClick={handleDelete}
          tabIndex={showDelete ? 0 : -1}
          aria-label="Delete session"
        >
          ×
        </button>
      )}
      {/* Card content, draggable */}
      <div
        className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow-md transition-transform duration-200 cursor-pointer"
        style={{
          transform:
            showDelete && swipeDirection === 'left'
              ? 'translateX(-62px)'
              : showDelete && swipeDirection === 'right'
              ? 'translateX(62px)'
              : `translateX(${dragX}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={e => { startX.current = e.clientX; }}
        onMouseMove={e => { if (startX.current != null) handleTouchMove(e); }}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onClick={() => {
          if (!showDelete && Math.abs(dragX) < 5) navigate(`/history/${session.id}`);
        }}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">{session.gameName}</span>
          <span className="text-sm text-gray-400">{session.date}</span>
        </div>
        <div className="flex gap-4 text-sm">
          {session.topWinners.map((winner, i) => (
            <span key={i} className={i === 0 ? "text-green-400" : "text-yellow-400"}>
              {winner.name} {winner.amount > 0 ? "+" : ""}{winner.amount}k
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
