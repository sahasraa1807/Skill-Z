export default function ProfileConfidenceBadge({ confidence }) {
  if (!confidence) return null;
  const { score, breakdown } = confidence;
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-400';
  const label = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Profile Confidence</span>
        <span className="text-lg font-bold text-gray-900">{score}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {breakdown?.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`text-xs ${item.earned ? 'text-green-600' : 'text-gray-400'}`}>
              {item.earned ? '✓' : '✗'}
            </span>
            <span className={`text-xs ${item.earned ? 'text-gray-700' : 'text-gray-400'}`}>
              {item.label}
            </span>
            <span className="ml-auto text-xs text-gray-400">{item.earned ? `+${item.points}` : `+0/${item.points}`}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 border-t border-gray-100 pt-3">
        Profile confidence shows how much information Skillz has about you — not how good you are.
      </p>
    </div>
  );
}
