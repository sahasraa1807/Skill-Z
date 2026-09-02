import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import SkillTag from '../components/common/SkillTag';
import CompatibilityBadge from '../components/common/CompatibilityBadge';
import CandidateCard from '../components/people/CandidateCard';
import InviteModal from '../components/people/InviteModal';
import JoinRequestModal from '../components/projects/JoinRequestModal';
import OwnerApplicationPanel from '../components/projects/OwnerApplicationPanel';
import { getProjectById, getProjectApplications, acceptApplication, rejectApplication, applyToProject } from '../services/projectService';
import { getProjectCompatibility, getRecommendedCandidates } from '../services/matchingService';
import { sendInvitation } from '../services/invitationService';
import { PROJECT_TYPES, PROJECT_STATUSES } from '../utils/constants';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [compatibility, setCompatibility] = useState(null);
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Join request state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  
  // Invite candidate state (for owner)
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // App processing state
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProjectAndApps = async () => {
      setIsLoading(true);
      try {
        const res = await getProjectById(id);
        const projData = res.data;
        setProject(projData);
        
        const isProjectOwner = user && (user.id === projData.ownerId || user.id === projData.owner?.id || user.username === projData.owner?.username);

        // If owner, fetch applications and recommended candidates
        if (isProjectOwner) {
          const [appRes, recRes] = await Promise.all([
            getProjectApplications(id).catch(() => ({ data: [] })),
            getRecommendedCandidates(id, 4).catch(() => ({ data: [] }))
          ]);
          setApplications(appRes.data || []);
          setRecommendedCandidates(recRes.data || []);
        } else if (isAuthenticated) {
          // If viewing as a candidate, fetch real-time compatibility score
          try {
            const compRes = await getProjectCompatibility(id);
            setCompatibility(compRes.data);
          } catch (e) {
            console.error('Failed to load compatibility:', e);
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectAndApps();
  }, [id, user, isAuthenticated]);

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

  const handleOpenInvite = (candidate) => {
    setActiveCandidate(candidate);
    setInviteModalOpen(true);
  };

  const handleSendInvite = async (data) => {
    setIsSendingInvite(true);
    try {
      await sendInvitation(id, {
        receiverId: data.receiverId,
        roleName: data.roleName,
        message: data.message
      });
      setInviteModalOpen(false);
      setToastMessage(`Invitation sent to ${activeCandidate.name}!`);
      setTimeout(() => setToastMessage(''), 4000);
      // Refresh candidates list
      const recRes = await getRecommendedCandidates(id, 4);
      setRecommendedCandidates(recRes.data || []);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsSendingInvite(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage message="Loading project studio..." />;
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
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium flex items-center justify-between animate-in fade-in">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
            </div>
          )}

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
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                {project.domain}
              </span>
              <span className="bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-full font-medium">
                {typeLabel}
              </span>
              <span className={`${statusConfig.color} text-xs px-3 py-1 rounded-full font-medium`}>
                {statusConfig.label}
              </span>
              {compatibility && !isOwner && (
                <CompatibilityBadge compatibility={compatibility} size="md" />
              )}
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

          {/* Open Roles */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Open Roles & Required Skills</h2>
            
            {!project.roles || project.roles.length === 0 ? (
              <p className="text-gray-500 italic">No specific roles defined.</p>
            ) : (
              <div className="space-y-4">
                {project.roles.map((role, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900 text-base">{role.roleName}</h3>
                      <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-gray-200 text-gray-700">
                        {role.openings} opening{role.openings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {role.skills && role.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {role.skills.map((rs, sIdx) => (
                          <SkillTag key={sIdx} name={rs.skill?.name || rs.name} />
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
          {isOwner && applications.length > 0 && (
            <OwnerApplicationPanel applications={applications} onAccept={handleAccept} onReject={handleReject} isProcessing={isProcessing} />
          )}

          {/* Owner Recommended Candidates Section */}
          {isOwner && recommendedCandidates.length > 0 && (
            <div className="bg-gradient-to-br from-primary-50 via-white to-blue-50 p-6 rounded-3xl border border-primary-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-primary-600 text-white rounded-lg text-sm">✨</span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Recommended Candidates For This Project</h2>
                    <p className="text-xs text-gray-500">Based on your open roles, required skills, and commitment hours.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedCandidates.map(candidate => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onInvite={handleOpenInvite}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          
          {/* Action Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            {isOwner ? (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-2">You own this project</p>
                <p className="text-xs text-gray-500 mb-4">Manage applications or invite candidates directly.</p>
                <Link to="/people" className="w-full block">
                  <Button variant="secondary" size="sm" fullWidth>
                    Find Teammates
                  </Button>
                </Link>
              </div>
            ) : isMember ? (
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                  ✓ Team Member
                </span>
                <p className="text-xs text-gray-500">You are already a member of this project team.</p>
              </div>
            ) : applySuccess ? (
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                  ✓ Application Sent
                </span>
                <p className="text-xs text-gray-500">Your application has been submitted to the project owner.</p>
              </div>
            ) : (
              <div>
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={() => setIsJoinModalOpen(true)}
                  disabled={project.status !== 'RECRUITING'}
                >
                  {project.status === 'RECRUITING' ? 'Request to Join' : 'Recruitment Closed'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {project.status === 'RECRUITING' ? 'Send an application note to the owner.' : 'This project is not currently accepting members.'}
                </p>
              </div>
            )}
          </div>

          {/* Project Owner Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Project Owner</h3>
            <div className="flex items-center gap-3">
              <Avatar user={project.owner} size="md" />
              <div>
                <Link to={`/profile/${project.owner?.username}`} className="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  {project.owner?.name}
                </Link>
                <p className="text-xs text-gray-500">@{project.owner?.username}</p>
              </div>
            </div>
          </div>

          {/* Team Members Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Team Members ({project.teamMembers?.length || 1})
            </h3>
            
            <div className="space-y-3">
              {/* Owner */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Avatar user={project.owner} size="sm" />
                  <div>
                    <p className="font-semibold text-gray-900">{project.owner?.name}</p>
                    <p className="text-gray-400">Owner</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">Lead</span>
              </div>

              {/* Members */}
              {project.teamMembers?.map((member) => (
                <div key={member.id} className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar user={member.user} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{member.user?.name}</p>
                      <p className="text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Member</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Join Request Modal */}
      {isJoinModalOpen && (
        <JoinRequestModal 
          projectTitle={project.title}
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onSubmit={handleApply}
          isLoading={isApplying}
        />
      )}

      {/* Invite Modal for owner */}
      {inviteModalOpen && activeCandidate && (
        <InviteModal 
          candidate={activeCandidate}
          ownedProjects={[project]}
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onSend={handleSendInvite}
          isLoading={isSendingInvite}
        />
      )}
    </PageWrapper>
  );
}
