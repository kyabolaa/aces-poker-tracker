// Activity log view (skeleton)
export default function ActivityLog({ logEntries }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Activity Log</h2>
        {/* TODO: Render log entries, color-coded by type */}
        <button className="mt-6 px-4 py-2 bg-indigo-500 rounded-lg text-white w-full">Close</button>
      </div>
    </div>
  );
}
