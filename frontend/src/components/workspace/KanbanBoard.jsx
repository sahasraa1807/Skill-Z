import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog', icon: '📋', color: 'border-t-gray-400' },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: '⏳', color: 'border-t-blue-500' },
  { id: 'IN_REVIEW', title: 'In Review', icon: '🔍', color: 'border-t-amber-500' },
  { id: 'DONE', title: 'Done (Shipped)', icon: '🎉', color: 'border-t-emerald-500' }
];

export default function KanbanBoard({ 
  tasksByStatus = {}, 
  onStatusChange, 
  onDeleteTask, 
  onOpenCreateModal 
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sprint Kanban Board</h3>
          <p className="text-xs text-gray-500">Track and advance deliverables across project lifecycle stages.</p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>+</span> New Task
        </button>
      </div>

      {/* 4 Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const tasks = tasksByStatus[col.id] || [];

          return (
            <div 
              key={col.id}
              className={`bg-gray-50/80 rounded-2xl p-4 border border-gray-200 border-t-4 ${col.color} flex flex-col gap-3 min-h-[360px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{col.icon}</span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{col.title}</span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs">
                  {tasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex flex-col gap-3">
                {tasks.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-xs text-gray-400 italic">No tasks</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusChange={onStatusChange}
                      onDelete={onDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
