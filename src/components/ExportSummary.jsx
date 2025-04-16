// Export summary and copy button (skeleton)
export default function ExportSummary({ summaryText, onCopy }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 mt-6 flex flex-col items-center">
      <pre className="whitespace-pre-wrap text-lg mb-2">{summaryText}</pre>
      <button className="px-4 py-2 bg-indigo-500 rounded-lg text-white" onClick={onCopy}>Copy</button>
    </div>
  );
}
