import { useState } from 'react';
import { PROFICIENCY_COLORS } from '../../utils/constants';

export default function SkillTag({ 
  name, 
  level, 
  onRemove, 
  verified = false, 
  evidenceSummary = '',
  verificationSource = ''
}) {
  const [showEvidence, setShowEvidence] = useState(false);
  const colorClass = PROFICIENCY_COLORS[level] || 'bg-gray-100 text-gray-700';

  return (
    <div className="relative inline-flex items-center">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} transition-shadow hover:shadow-xs`}>
        {name}
        {level && <span className="opacity-70">· {level.charAt(0) + level.slice(1).toLowerCase()}</span>}
        
        {verified && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowEvidence(!showEvidence);
            }}
            onMouseEnter={() => setShowEvidence(true)}
            onMouseLeave={() => setShowEvidence(false)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-bold ml-0.5 cursor-pointer"
            title={evidenceSummary || 'Verified Skill'}
          >
            <span className="bg-primary-100 text-primary-700 rounded-full px-1 text-[10px] leading-tight font-black flex items-center gap-0.5">
              ✓ Verified
            </span>
          </button>
        )}

        {onRemove && (
          <button onClick={onRemove} className="ml-1 hover:opacity-75 transition-opacity" aria-label={`Remove ${name}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>

      {/* Evidence Tooltip Popover */}
      {showEvidence && evidenceSummary && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-gray-900 text-white rounded-xl shadow-xl text-left z-50 pointer-events-none animate-in fade-in zoom-in duration-150"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-primary-400 font-bold text-xs">🛡️ Verified Evidence</span>
          </div>
          <p className="text-[11px] text-gray-200 leading-snug">{evidenceSummary}</p>
          {verificationSource && (
            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-1">
              Source: {verificationSource.replace('_', ' ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
