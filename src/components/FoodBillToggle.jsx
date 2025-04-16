// Toggle switch for pre/post food settlement (skeleton)
export default function FoodBillToggle({ value, onToggle }) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm">Pre-Food</span>
      <button className={`w-12 h-6 rounded-full transition-all ${value ? 'bg-green-500' : 'bg-gray-400'}`} onClick={onToggle}>
        <span className={`block w-6 h-6 rounded-full bg-white shadow transform transition-transform ${value ? 'translate-x-6' : ''}`}></span>
      </button>
      <span className="text-sm">Post-Food</span>
    </div>
  );
}
