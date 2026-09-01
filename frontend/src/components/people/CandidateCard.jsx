import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import SkillTag from '../common/SkillTag';
import Button from '../common/Button';
import { EXPERIENCE_LEVELS } from '../../utils/constants';

export default function CandidateCard({ candidate, onInvite, currentUserId }) {
  const expInfo = EXPERIENCE_LEVELS.find(e => e.value === candidate.preferences?.experienceLevel);
  const isSelf = currentUserId && (currentUserId === candidate.id || currentUserId === candidate.userId);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header with Avatar & Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar name={candidate.name} src={candidate.avatarUrl} size="lg" />
          <div className="flex-1 min-w-0">
            <Link 
              to={`/profile/${candidate.username}`} 
              className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors block truncate"
            >
              {candidate.name}
            </Link>
            <p className="text-sm text-gray-500 truncate">@{candidate.username}</p>
            {candidate.location && (
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {candidate.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {candidate.bio ? (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {candidate.bio}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-4">No bio provided</p>
        )}

        {/* Badges: Experience & Availability */}
        <div className="flex flex-wrap gap-2 mb-4">
          {expInfo && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {expInfo.label}
            </span>
          )}
          {candidate.preferences?.availabilityHours && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {candidate.preferences.availabilityHours}h / week
            </span>
          )}
          {candidate.preferences?.preferWeekends && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
              Weekends
            </span>
          )}
          {candidate.preferences?.preferWeekdays && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
              Weekdays
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-hidden">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.slice(0, 6).map((us) => (
                <SkillTag 
                  key={us.id || us.skillId} 
                  name={us.skill?.name || us.name} 
                  level={us.proficiencyLevel} 
                />
              ))
            ) : (
              <span className="text-xs text-gray-400">No skills listed</span>
            )}
            {candidate.skills && candidate.skills.length > 6 && (
              <span className="text-xs text-gray-500 self-center">+{candidate.skills.length - 6} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-100 flex gap-2">
        <Link 
          to={`/profile/${candidate.username}`} 
          className="flex-1"
        >
          <Button variant="secondary" size="sm" fullWidth>
            View Profile
          </Button>
        </Link>
        {!isSelf && onInvite && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onInvite(candidate)}
          >
            Invite
          </Button>
        )}
      </div>
    </div>
  );
}
