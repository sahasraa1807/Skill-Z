import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import SkillTag from '../components/common/SkillTag';
import JoinRequestModal from '../components/projects/JoinRequestModal';
import OwnerApplicationPanel from '../components/projects/OwnerApplicationPanel';
import { getProjectById, getProjectApplications, acceptApplication, rejectApplication, applyToProject } from '../services/projectService';
import { PROJECT_TYPES, PROJECT_STATUSES } from '../utils/constants';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Join request state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  
  // App processing state
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProjectAndApps = async () => {
      setIsLoading(true);
      try {
        const res = await getProjectById(id);
        setProject(res.data);
        
        // If owner, fetch applications
        const isProjectOwner = user && (user.id === res.data.ownerId || user.id === res.data.owner?.id || user.username === res.data.owner?.username);
        if (isProjectOwner) {
          const appRes = await getProjectApplications(id);
          setApplications(appRes.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectAndApps();
  }, [id, user]);

  const handleApply = async (message) => {
    setIsApplying(true);
    try {
      await applyToProject(id, message);
      setApplySuccess(true);
      setIsJoinModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const handleAccept = async (appId) => {
    setIsProcessing(true);
    try {
      await acceptApplication(appId);
      // Refresh project to get updated team members
      const res = await getProjectById(id);
      setProject(res.data);
      // Remove accepted app from list
      setApplications(apps => apps.filter(a => a.id !== appId));
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to accept application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (appId) => {
    setIsProcessing(true);
    try {
      await rejectApplication(appId);
      setApplications(apps => apps.filter(a => a.id !== appId));
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to reject application');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error || !project) return <ErrorMessage message={error || 'Project not found'} />;

  const isOwner = user && (user.id === project.ownerId || user.id === project.owner?.id || user.username === project.owner?.username);
  
  // Check if user is already a member
  const isMember = user && project.teamMembers?.some(m => {
    const memberId = m.user?.id || m.userId;
    return memberId === user.id;
  });

  const statusConfig = PROJECT_STATUSES.find((s) => s.value === project.status) || PROJECT_STATUSES[0];
  const typeLabel = PROJECT_TYPES.find((t) => t.value === project.projectType)?.label || project.projectType;

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Header Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative">
            {isOwner && (
              <Link 
                to={`/projects/${id}/edit`} 
                className="absolute top-6 right-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Edit Project
              </Link>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                {project.domain}
              </span>
              <span className="bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-full font-medium">
                {typeLabel}
              </span>
              <span className={`${statusConfig.color} text-xs px-3 py-1 rounded-full font-medium`}>
                {statusConfig.label}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{project.title}</h1>
            
            <div className="prose max-w-none text-gray-600 mb-8 whitespace-pre-wrap">
              {project.description}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{project.duration || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Commitment</p>
                <p className="text-sm font-semibold text-gray-900">{project.commitmentHours ? `${project.commitmentHours}h / week` : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Team Size</p>
                <p className="text-sm font-semibold text-gray-900">Up to {project.maxTeamSize} members</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Created</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Open Roles</h2>
            
            {!project.roles || project.roles.length === 0 ? (
              <p className="text-gray-500 italic">No specific roles defined.</p>
            ) : (
              <div className="space-y-6">
                {project.roles.map((role, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">{role.roleName}</h3>
                      <span className="text-xs font-medium bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-600">
                        {role.openings} opening{role.openings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {role.skillIds && role.skillIds.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {role.skillIds.map(skill => (
                          <SkillTag key={skill._id || skill} skill={skill} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No specific skills required.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Owner Applications Panel */}
          {isOwner && <OwnerApplicationPanel applications={applications} onAccept={handleAccept} onReject={handleReject} isProcessing={isProcessing} />}

        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          
          {/* Action Card */}
          {!isOwner && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              {applySuccess ? (
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">Application sent!</p>
                  <p className="text-xs text-green-600 mt-1">The project owner will review your request.</p>
                </div>
              ) : isMember ? (
                <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <p className="text-primary-800 font-medium">You are a member</p>
                </div>
              ) : user ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">Interested?</h3>
                  <p className="text-sm text-gray-600 mb-4">Send a request to join this project team.</p>
                  <Button variant="primary" fullWidth onClick={() => setIsJoinModalOpen(true)}>
                    Request to Join
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Log in to apply for this project.</p>
                  <Link to="/login">
                    <Button variant="primary" fullWidth>Log In</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Owner Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Project Owner</h3>
            {project.owner && (
              <Link to={`/profile/${project.owner.username}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                <Avatar user={project.owner} size="md" />
                <div>
                  <p className="font-medium text-gray-900">{project.owner.firstName} {project.owner.lastName}</p>
                  <p className="text-xs text-gray-500">@{project.owner.username}</p>
                </div>
              </Link>
            )}
          </div>

          {/* Team Members */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Team Members ({project.teamMembers?.length || 0}/{project.maxTeamSize})</h3>
            
            {!project.teamMembers || project.teamMembers.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No team members yet.</p>
            ) : (
              <div className="space-y-3">
                {project.teamMembers.map((member, idx) => (
                  <Link key={idx} to={`/profile/${member.user?.username}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                    <Avatar user={member.user} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.user?.firstName} {member.user?.lastName}</p>
                      <p className="text-xs text-primary-600">{member.role || 'Member'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <JoinRequestModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={handleApply}
        isLoading={isApplying}
        projectTitle={project.title}
      />
    </PageWrapper>
  );
}
