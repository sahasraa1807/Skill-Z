export default function AIProjectAnalysisCard({ analysis }) {
  if (!analysis) return null;

  const { complexityTier, techStackSummary = [], suggestedRoles = [], valueProposition } = analysis;

  let complexityColor = 'bg-blue-50 text-blue-700 border-blue-200';
  if (complexityTier === 'HIGH') complexityColor = 'bg-purple-50 text-purple-700 border-purple-200';
  if (complexityTier === 'LOW') complexityColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <div className="bg-gradient-to-br from-primary-50/70 via-white to-blue-50/50 rounded-2xl border border-primary-100 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-primary-100 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-primary-600 text-white rounded-lg text-xs">✨</span>
          <h3 className="font-bold text-gray-900 text-base">AI Project Insights</h3>
        </div>
        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${complexityColor}`}>
          {complexityTier} Complexity
        </span>
      </div>

      {valueProposition && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Value Proposition</p>
          <p className="text-xs text-gray-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-gray-100">
            {valueProposition}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Tech Stack */}
        {techStackSummary.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Identified Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {techStackSummary.map((tech, idx) => (
                <span 
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white text-primary-700 border border-primary-100 shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Roles */}
        {suggestedRoles.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Suggested Team Roles</p>
            <ul className="space-y-1.5">
              {suggestedRoles.map((role, idx) => (
                <li key={idx} className="text-xs bg-white p-2 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900">{role.roleName}</span>
                  <span className="text-gray-500 block text-[11px] mt-0.5">{role.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
