// Audit row for settlement sum/discrepancy (skeleton)
export default function AuditRow({ total }) {
  return (
    <div className={`w-full text-center font-bold py-2 ${total !== 0 ? 'text-red-500' : 'text-green-400'}`}>
      {total !== 0 ? `Discrepancy: ${total > 0 ? '+' : ''}${total}` : 'All Settled!'}
    </div>
  );
}
