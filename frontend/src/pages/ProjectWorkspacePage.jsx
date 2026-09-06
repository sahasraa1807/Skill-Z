import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import KanbanBoard from '../components/workspace/KanbanBoard';
import TaskModal from '../components/workspace/TaskModal';
import ResourceHubCard from '../components/workspace/ResourceHubCard';
import ActivityFeed from '../components/workspace/ActivityFeed';
import { 
  getWorkspace, 
  createTask, 
  updateTask, 
  deleteTask, 
  addResource, 
  deleteResource 
} from '../services/workspaceService';

export default function ProjectWorkspacePage() {
  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchWorkspace = async () => {
    try {
      const res = await getWorkspace(id);
      setWorkspace(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project workspace');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const handleCreateTask = async (taskData) => {
    setIsCreatingTask(true);
    try {
      await createTask(id, taskData);
      setIsTaskModalOpen(false);
      setToastMessage('Task created and added to sprint backlog!');
      setTimeout(() => setToastMessage(''), 4000);
      await fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      await updateTask(taskId, { status: nextStatus });
      await fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      await fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleAddResource = async (data) => {
    try {
      await addResource(id, data);
      await fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add resource link');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await deleteResource(resourceId);
      await fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove resource link');
    }
  };

  if (isLoading) return <LoadingSpinner fullPage message="Loading team workspace..." />;
  if (error || !workspace) return <ErrorMessage message={error || 'Workspace not accessible'} />;

  const { project, teamRoster, tasksByStatus, resources, activities, completedTasks, totalTasks } = workspace;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm font-medium flex items-center justify-between animate-in fade-in">
            <span>✨ {toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
          </div>
        )}

        {/* Workspace Top Header Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                Workspace
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {project.domain}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">{project.title}</h1>
            <p className="text-xs text-gray-500 mt-1 max-w-xl line-clamp-1">{project.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Team Avatars Roster */}
            <div className="flex items-center -space-x-2">
              {teamRoster.map((member) => (
                <div key={member.id} title={`${member.name} (@${member.username})`}>
                  <Avatar name={member.name} src={member.avatarUrl} size="sm" className="ring-2 ring-white" />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Link to={`/projects/${id}`}>
                <Button variant="secondary" size="sm">
                  Project Details
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
                + New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-base">🚀</span>
            <div>
              <p className="text-xs font-bold text-gray-800">Sprint Delivery Progress</p>
              <p className="text-[11px] text-gray-500">{completedTasks} of {totalTasks} tasks shipped</p>
            </div>
          </div>

          <div className="w-full sm:w-64 flex items-center gap-3">
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-gray-700">{progressPercent}%</span>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Kanban Board (3 Columns wide) */}
          <div className="lg:col-span-3">
            <KanbanBoard
              tasksByStatus={tasksByStatus}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onOpenCreateModal={() => setIsTaskModalOpen(true)}
            />
          </div>

          {/* Sidebar: Resources & Activity Feed (1 Column wide) */}
          <div className="flex flex-col gap-6">
            <ResourceHubCard
              resources={resources}
              onAddResource={handleAddResource}
              onDeleteResource={handleDeleteResource}
            />

            <ActivityFeed activities={activities} />
          </div>

        </div>

      </div>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          teamRoster={teamRoster}
          onCreateTask={handleCreateTask}
          isLoading={isCreatingTask}
        />
      )}
    </PageWrapper>
  );
}
