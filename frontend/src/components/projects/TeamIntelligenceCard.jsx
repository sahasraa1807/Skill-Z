import { useState, useEffect } from 'react';
import { getProjectTeamIntelligence } from '../../services/teamIntelligenceService';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

export default function TeamIntelligenceCard({ projectId, isOwner, onInviteCandidate }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    const fetchIntelligence = async () => {
      setIsLoading(true);
      try {
        const res = await getProjectTeamIntelligence(projectId);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to analyze team intelligence');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIntelligence();
  }, [projectId]);

  if (isLoading) return <LoadingSpinner message="Analyzing team composition..." />;
  if (error || !data) return null;

  const {
    teamHealthScore = 0,
    healthLabel = 'Team Health',
    healthBadge = 'bg-gray-100 text-gray-800',
    domainMatrix = [],
    roleCoverage = [],
    recommendations = [],
    roleRecommendations = []
  } = data;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
      
      {/* Header & Health Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {teamHealthScore}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Team Intelligence</h3>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${healthBadge}`}>
                {healthLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated analysis of team role coverage, skill balance, and candidate backfills.
            </p>
          </div>
        </div>

        {/* Health Score Meter Bar */}
        <div className="w-full sm:w-48 bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${
              teamHealthScore >= 80 ? 'bg-emerald-500' : teamHealthScore >= 50 ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(8, teamHealthScore))}%` }}
          />
        </div>
      </div>

      {/* Domain Skill Matrix */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Domain Skill Coverage
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {domainMatrix.map((item, idx) => (
            <div 
              key={idx}
              className={`p-2.5 rounded-xl border text-center flex items-center justify-between transition-all ${
                item.isCovered 
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold' 
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <span className="text-xs">{item.domain}</span>
              <span className={`text-xs font-black ${item.isCovered ? 'text-emerald-600' : 'text-gray-300'}`}>
                {item.statusSymbol}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations & Actionable Insights */}
      {recommendations.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>💡</span> Team Optimization Suggestion
          </h4>
          <ul className="space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-amber-800 font-medium">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Role Gap Backfill Candidate Pools */}
      {isOwner && roleRecommendations.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🎯</span> Recommended Candidates for Open Roles
          </h4>

          <div className="space-y-5">
            {roleRecommendations.map((roleRec) => (
              <div key={roleRec.roleId} className="bg-gray-50/70 border border-gray-200 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-extrabold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-0.5 rounded-full">
                      Open Role: {roleRec.roleName}
                    </span>
                    {roleRec.requiredSkills && roleRec.requiredSkills.length > 0 && (
                      <span className="text-xs text-gray-500 ml-2">
                        Requires: {roleRec.requiredSkills.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate Pool Horizontal Cards */}
                {roleRec.candidates.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No direct matches found for this specific role yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {roleRec.candidates.map((candidate) => (
                      <div 
                        key={candidate.id}
                        className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar name={candidate.name} src={candidate.avatarUrl} size="sm" />
                              <div>
                                <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{candidate.name}</h5>
                                <p className="text-[10px] text-gray-500">@{candidate.username}</p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                              {candidate.compatibilityScore}%
                            </span>
                          </div>

                          {candidate.topSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {candidate.topSkills.map((sk, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full text-xs py-1"
                          onClick={() => onInviteCandidate && onInviteCandidate(candidate)}
                        >
                          Invite to Role
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
