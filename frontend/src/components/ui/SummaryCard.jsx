export function SummaryCard({ label, value, sub }) {
  return (
    <div className="bg-gray-800 border border-gray-700/50 rounded-lg p-4">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-3xl font-bold text-white mt-1">{value}</div>
      {sub && <div className="text-gray-500 text-xs mt-1">{sub}</div>}
    </div>
  );
}
