import Button from '../common/Button';

export default function ProjectProofCard({ proof, isOwnProfile, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-bold text-gray-900 text-base line-clamp-1">{proof.title}</h4>
          {proof.verified && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              ✓ Verified Repo
            </span>
          )}
        </div>

        {proof.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {proof.description}
          </p>
        )}

        {/* Skills Tagged */}
        {proof.skillsUsed && proof.skillsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {proof.skillsUsed.map((skill, idx) => (
              <span 
                key={idx} 
                className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Links & Metrics */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          {proof.repoUrl && (
            <a 
              href={proof.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Repository
              {proof.metrics?.stars != null && (
                <span className="text-[10px] text-amber-600 font-bold ml-0.5">★ {proof.metrics.stars}</span>
              )}
            </a>
          )}

          {proof.liveUrl && (
            <a 
              href={proof.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
            >
              <span>↗</span> Live Demo
            </a>
          )}
        </div>

        {isOwnProfile && (
          <button 
            type="button" 
            onClick={() => onDelete(proof.id)}
            className="text-gray-400 hover:text-red-500 text-xs transition-colors p-1"
            title="Delete Proof"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
