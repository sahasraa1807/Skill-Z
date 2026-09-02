import { useState, useEffect } from 'react';
import { getGitHubStats } from '../../services/matchingService';

export default function GitHubStatsCard({ githubUrl }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!githubUrl) return;

    // Extract username from github.com/username or @username
    let username = githubUrl.trim();
    if (username.includes('github.com/')) {
      const parts = username.split('github.com/');
      username = parts[1]?.split('/')[0] || '';
    }
    username = username.replace(/^@/, '').trim();

    if (!username) return;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await getGitHubStats(username);
        setStats(res.data);
      } catch (err) {
        // Fail silently and do not disrupt the profile
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [githubUrl]);

  if (!githubUrl || isLoading) return null;
  if (!stats) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span className="font-bold text-gray-900 text-sm">GitHub Activity</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Verified
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <p className="text-base font-bold text-gray-900">{stats.publicRepos}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">Repos</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <p className="text-base font-bold text-gray-900">{stats.followers}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">Followers</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <p className="text-base font-bold text-gray-900">{stats.totalStars}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">Stars</p>
        </div>
      </div>

      {stats.topLanguages && stats.topLanguages.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Top Languages</p>
          <div className="flex flex-wrap gap-1.5">
            {stats.topLanguages.map((lang) => (
              <span 
                key={lang} 
                className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-primary-50 text-primary-700 border border-primary-100"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
