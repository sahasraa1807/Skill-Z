import { useState } from 'react';

export default function CompatibilityBadge({ compatibility, size = 'sm', showDetails = true }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!compatibility || typeof compatibility.score !== 'number') {
    return null;
  }

  const { score, breakdown, reasons } = compatibility;

  // Determine color scheme based on score
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotColor = 'bg-emerald-500';
  if (score >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (score >= 65) {
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (score >= 50) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else {
    badgeColor = 'bg-gray-100 text-gray-700 border-gray-200';
    dotColor = 'bg-gray-400';
  }

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1 text-sm font-semibold' 
    : 'px-2 py-0.5 text-xs font-medium';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (showDetails) setIsOpen(!isOpen);
        }}
        onMouseEnter={() => {
          if (showDetails) setIsOpen(true);
        }}
        onMouseLeave={() => {
          if (showDetails) setIsOpen(false);
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border ${badgeColor} ${sizeClasses} transition-all hover:scale-105`}
        title="View Compatibility Breakdown"
      >
        <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
        <span>⚡ {score}% Match</span>
      </button>

      {/* Popover Breakdown */}
      {isOpen && showDetails && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in zoom-in duration-150 text-left"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">Compatibility Breakdown</span>
            </div>
            <span className="text-xs font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {score}% Total
            </span>
          </div>

          {/* Breakdown bars */}
          {breakdown && (
            <div className="space-y-2.5 mb-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Skills Synergy</span>
                  <span className="font-semibold text-gray-900">{breakdown.skills || 0} / 40 pts</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all"
                    style={{ width: `${((breakdown.skills || 0) / 40) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Goal Alignment</span>
                  <span className="font-semibold text-gray-900">{breakdown.goals || 0} / 25 pts</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${((breakdown.goals || 0) / 25) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Schedule & Hours</span>
                  <span className="font-semibold text-gray-900">{breakdown.schedule || 0} / 20 pts</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${((breakdown.schedule || 0) / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Experience Level</span>
                  <span className="font-semibold text-gray-900">{breakdown.experience || 0} / 15 pts</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${((breakdown.experience || 0) / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Synergy Reasons */}
          {reasons && reasons.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Key Synergy Factors</p>
              <ul className="space-y-1">
                {reasons.map((reason, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="text-primary-600 font-bold leading-none">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
