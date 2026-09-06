import Avatar from '../common/Avatar';

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <span className="p-1.5 bg-primary-50 text-primary-600 rounded-xl text-sm">⚡</span>
        <h4 className="text-sm font-bold text-gray-900">Team Activity Feed</h4>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-4">No team activity logged yet.</p>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex items-start gap-2.5 text-xs">
              <Avatar name={act.user?.name || 'User'} src={act.user?.avatarUrl} size="sm" />
              <div className="flex-1 leading-snug">
                <p className="text-gray-800">
                  <strong className="text-gray-900 font-bold">{act.user?.name || 'Teammate'}</strong>{' '}
                  <span className="text-gray-600">{act.message}</span>
                </p>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(act.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
