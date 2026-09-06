import Avatar from '../common/Avatar';

const PRIORITY_STYLES = {
  URGENT: 'bg-red-50 text-red-700 border-red-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  LOW: 'bg-gray-50 text-gray-600 border-gray-200'
};

const STATUS_TRANSITIONS = {
  BACKLOG: ['IN_PROGRESS'],
  IN_PROGRESS: ['BACKLOG', 'IN_REVIEW'],
  IN_REVIEW: ['IN_PROGRESS', 'DONE'],
  DONE: ['IN_REVIEW']
};

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const allowedNext = STATUS_TRANSITIONS[task.status] || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-3 group">
      {/* Top row: Priority & Delete */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM}`}>
          {task.priority}
        </span>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs"
          title="Delete task"
        >
          ✕
        </button>
      </div>

      {/* Task Content */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 leading-snug">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Assignee & Quick Status Mover */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        {task.assignee ? (
          <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.name}`}>
            <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="sm" />
            <span className="text-[11px] text-gray-600 font-medium truncate max-w-[90px]">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-400 italic">Unassigned</span>
        )}

        {/* Advance Status Button(s) */}
        <div className="flex items-center gap-1">
          {allowedNext.map((nextStatus) => (
            <button
              key={nextStatus}
              type="button"
              onClick={() => onStatusChange(task.id, nextStatus)}
              className="text-[10px] font-bold bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-700 px-2 py-1 rounded-lg transition-colors"
            >
              → {nextStatus === 'IN_PROGRESS' ? 'Start' : nextStatus === 'IN_REVIEW' ? 'Review' : nextStatus === 'DONE' ? 'Ship' : 'Backlog'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
