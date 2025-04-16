// Modal for 'A Player Left' action (skeleton)
export default function PlayerLeftModal({ open, onClose, players, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-80">
        <h2 className="text-xl font-bold mb-4">A Player Left</h2>
        {/* TODO: Dropdown for player, numeric input for chip count */}
        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-indigo-500 rounded-lg text-white" onClick={onClose}>Cancel</button>
          {/* TODO: Submit button */}
        </div>
      </div>
    </div>
  );
}
