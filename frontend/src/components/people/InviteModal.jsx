import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

export default function InviteModal({ isOpen, onClose, candidate, ownedProjects = [], onSend, isLoading }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto-select first project if available
  useEffect(() => {
    if (ownedProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(ownedProjects[0].id);
    }
  }, [ownedProjects, selectedProjectId]);

  const selectedProject = ownedProjects.find(p => p.id === selectedProjectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }
    if (!roleName.trim()) {
      setError('Please select or specify a role name');
      return;
    }
    setError('');
    onSend({
      projectId: selectedProjectId,
      receiverId: candidate.id,
      roleName: roleName.trim(),
      message: message.trim()
    });
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Invite to Project</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Candidate Summary */}
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 mb-6">
          <Avatar name={candidate.name} src={candidate.avatarUrl} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{candidate.name}</p>
            <p className="text-xs text-gray-500 truncate">@{candidate.username}</p>
          </div>
        </div>

        {ownedProjects.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">You haven't created any active projects yet.</p>
            <Button variant="primary" size="sm" onClick={() => window.location.href = '/projects/create'}>
              + Create a Project First
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Select Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setRoleName('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              >
                {ownedProjects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title} ({proj.domain})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              {selectedProject?.roles && selectedProject.roles.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    required
                  >
                    <option value="" disabled>Select an open role</option>
                    {selectedProject.roles.map((r) => (
                      <option key={r.id} value={r.roleName}>
                        {r.roleName} ({r.openings} opening{r.openings > 1 ? 's' : ''})
                      </option>
                    ))}
                    <option value="Custom">Other (Custom Role)</option>
                  </select>

                  {roleName === 'Custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom role title..."
                      onChange={(e) => setRoleName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      required
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Message <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I saw your profile and think you'd be a fantastic fit for our project..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
                Send Invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
