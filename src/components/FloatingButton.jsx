// Floating action button (FAB) for dashboard actions
export default function FloatingButton({ position, icon, label, onClick }) {
  // position: 'bottom-left' | 'bottom-right' | etc.
  const base = "fixed z-40 p-4 rounded-full shadow-lg text-white transition-all ";
  const posClass = position === 'bottom-left'
    ? "left-6 bottom-6 bg-red-500 hover:bg-red-600"
    : "right-6 bottom-6 bg-blue-500 hover:bg-blue-600";
  return (
    <button className={base + posClass} onClick={onClick} aria-label={label}>
      {icon}
    </button>
  );
}
