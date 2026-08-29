import { PROFICIENCY_COLORS } from '../../utils/constants';

export default function SkillTag({ name, level, onRemove }) {
  const colorClass = PROFICIENCY_COLORS[level] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {name}
      {level && <span className="opacity-70">· {level.charAt(0) + level.slice(1).toLowerCase()}</span>}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-75 transition-opacity" aria-label={`Remove ${name}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
