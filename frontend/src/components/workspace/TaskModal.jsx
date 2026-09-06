import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

export default function TaskModal({ isOpen, onClose, teamRoster = [], onCreateTask, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      assigneeId: assigneeId || null,
      dueDate: dueDate || null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-primary-50 text-primary-600 rounded-xl text-lg">📋</span>
            <h3 className="text-lg font-bold text-gray-900">Create Sprint Task</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Task Title"
            id="task-title"
            placeholder="e.g. Implement GitHub OAuth integration"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            required
            error={error}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What needs to be accomplished and acceptance criteria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-primary-500 focus:border-primary-500 font-medium"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent ⚡</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-primary-500 focus:border-primary-500 font-medium"
              >
                <option value="">Unassigned</option>
                {teamRoster.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} (@{member.username})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} fullWidth>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
