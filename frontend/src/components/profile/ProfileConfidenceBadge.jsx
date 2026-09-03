export default function ProfileConfidenceBadge({ confidence, onActionClick }) {
  if (!confidence) return null;
  const { score = 0, tier = 'CALIBRATING', breakdown = [], nextActions = [] } = confidence;

  let tierConfig = {
    label: 'Calibrating',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
    icon: '🌱',
    desc: 'New user initial calibration. Connect external evidence to boost credibility.'
  };

  if (tier === 'VERIFIED' || score >= 70) {
    tierConfig = {
      label: 'Verified Builder',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      barColor: 'bg-emerald-500',
      icon: '🛡️',
      desc: 'High-trust profile backed by verified GitHub activity and code evidence.'
    };
  } else if (tier === 'ESTABLISHED' || score >= 40) {
    tierConfig = {
      label: 'Established',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      barColor: 'bg-blue-500',
      icon: '⚡',
      desc: 'Good profile foundation with connected social or project proof.'
    };
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{tierConfig.icon}</span>
          <span className="text-sm font-bold text-gray-900">Profile Confidence</span>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tierConfig.badge}`}>
          {tierConfig.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold text-gray-900">{score}%</span>
        <span className="text-xs text-gray-500 font-medium">Confidence Score</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${tierConfig.barColor}`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        {tierConfig.desc}
      </p>

      {/* Quadrant Breakdown */}
      {breakdown && breakdown.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-gray-100 mb-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Confidence Factors
          </p>
          {breakdown.map((item, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>{item.category}</span>
                <span className="font-semibold text-gray-900">{item.score} / {item.max} pts</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-500 h-full rounded-full transition-all"
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next Actions to Boost Confidence */}
      {nextActions && nextActions.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-primary-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <span>🚀</span> Boost Your Confidence
          </p>
          <ul className="space-y-2">
            {nextActions.map((action, idx) => (
              <li key={idx} className="text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-colors flex items-center justify-between">
                <span className="flex-1 pr-2 leading-tight">{action.label}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                  +{action.points}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
