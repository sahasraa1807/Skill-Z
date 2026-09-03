import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import ProjectCard from '../components/projects/ProjectCard';
import { getDashboard, getProfileConfidence } from '../services/userService';
import { acceptInvitation, rejectInvitation } from '../services/invitationService';
import { getRecommendedProjects } from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import { PROJECT_STATUSES } from '../utils/constants';

export default function DashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'teams' | 'applications' | 'invitations'
  const [dashboard, setDashboard] = useState(null);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [dashRes, recRes, confRes] = await Promise.all([
        getDashboard(),
        getRecommendedProjects(3).catch(() => ({ data: [] })),
        getProfileConfidence().catch(() => ({ data: null }))
      ]);
      setDashboard(dashRes.data);
      setRecommendedProjects(recRes.data || []);
      setConfidence(confRes?.data || null);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAcceptInvite = async (invitationId) => {
    setIsProcessing(true);
    try {
      await acceptInvitation(invitationId);
      setToastMessage('Invitation accepted! You have joined the project.');
      setTimeout(() => setToastMessage(''), 4000);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineInvite = async (invitationId) => {
    setIsProcessing(true);
    try {
      await rejectInvitation(invitationId);
      setToastMessage('Invitation declined.');
      setTimeout(() => setToastMessage(''), 4000);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to decline invitation');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage message="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  const ownedProjects = dashboard?.ownedProjects || [];
  const memberProjects = dashboard?.memberProjects || [];
  const joinRequests = dashboard?.joinRequests || [];
  const receivedInvitations = dashboard?.receivedInvitations || [];

  const pendingInvitesCount = receivedInvitations.filter(i => i.status === 'PENDING').length;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your created projects, teams, applications, and invitations.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/projects/create">
              <Button variant="primary" size="sm">
                + Create Project
              </Button>
            </Link>
            <Link to="/people">
              <Button variant="secondary" size="sm">
                Find Teammates
              </Button>
            </Link>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium flex items-center justify-between animate-in fade-in">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Phase 5: Cold Start Credibility Assistant */}
        {confidence && confidence.score < 60 && (
          <div className="p-5 bg-gradient-to-r from-amber-50 via-white to-primary-50 border border-amber-200/80 rounded-2xl shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-lg">🌱</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Cold Start: Build Your Credibility ({confidence.score}% Confidence)</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                      {confidence.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Your self-reported skills are currently calibrating. Connect GitHub and add public project proofs to unlock high-trust recommendations!
                  </p>
                </div>
              </div>
              <Link to={`/profile/${user?.username}`}>
                <Button variant="primary" size="sm" className="whitespace-nowrap">
                  Boost Confidence →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('projects')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'projects' 
                ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Projects</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{ownedProjects.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('teams')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'teams' 
                ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Teams</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{memberProjects.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('applications')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'applications' 
                ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{joinRequests.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('invitations')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
              activeTab === 'invitations' 
                ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            {pendingInvitesCount > 0 && (
              <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-primary-100" />
            )}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invitations</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{receivedInvitations.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Projects ({ownedProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'teams'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Teams ({memberProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Applications ({joinRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors relative ${
              activeTab === 'invitations'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Invitations ({receivedInvitations.length})
            {pendingInvitesCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary-600 text-white">
                {pendingInvitesCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: My Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {ownedProjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">You haven't posted any projects yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Create your first project to assemble a dream team of builders.</p>
                <Link to="/projects/create">
                  <Button variant="primary" size="sm">+ Post a Project</Button>
                </Link>
              </div>
            ) : (
              ownedProjects.map((p) => {
                const statusInfo = PROJECT_STATUSES.find(s => s.value === p.status) || PROJECT_STATUSES[0];
                return (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">
                          {p.domain}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <Link to={`/projects/${p.id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                        {p.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                        <span>👥 {p.teamMembers?.length || 1} team members</span>
                        <span>📋 {p.roles?.length || 0} defined roles</span>
                        {p._count?.joinRequests > 0 && (
                          <span className="text-primary-600 font-semibold">
                            📬 {p._count.joinRequests} join application{p._count.joinRequests > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link to={`/projects/${p.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Link to={`/projects/${p.id}`}>
                        <Button variant="primary" size="sm">Manage</Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: My Teams */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            {memberProjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No team memberships yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Explore open projects and request to join teams that match your skills.</p>
                <Link to="/projects">
                  <Button variant="primary" size="sm">Explore Projects</Button>
                </Link>
              </div>
            ) : (
              memberProjects.map((p) => {
                const myRole = p.teamMembers?.find(m => m.userId === user?.id)?.role || 'Member';
                return (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-primary-100 text-primary-700">
                          Role: {myRole}
                        </span>
                        <span className="text-xs text-gray-400">
                          Led by {p.owner?.name}
                        </span>
                      </div>
                      <Link to={`/projects/${p.id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                        {p.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.description}</p>
                    </div>

                    <Link to={`/projects/${p.id}`} className="self-end md:self-center">
                      <Button variant="secondary" size="sm">View Team & Project</Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: My Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {joinRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No applications submitted</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">When you apply to join projects, track your status here.</p>
                <Link to="/projects">
                  <Button variant="primary" size="sm">Explore Projects</Button>
                </Link>
              </div>
            ) : (
              joinRequests.map((req) => {
                const statusStyles = {
                  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                  ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  REJECTED: 'bg-red-50 text-red-700 border-red-200',
                  WITHDRAWN: 'bg-gray-50 text-gray-700 border-gray-200'
                };
                return (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusStyles[req.status] || statusStyles.PENDING}`}>
                          {req.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          Applied on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link to={`/projects/${req.projectId}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                        {req.project?.title}
                      </Link>
                      {req.message && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          "{req.message}"
                        </p>
                      )}
                    </div>

                    <Link to={`/projects/${req.projectId}`} className="self-end md:self-center">
                      <Button variant="secondary" size="sm">View Project</Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 4: Invitations Received */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            {receivedInvitations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No invitations received</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Complete your profile to increase visibility and receive invitations from project creators.</p>
                <Link to="/profile/edit">
                  <Button variant="secondary" size="sm">Enhance Profile</Button>
                </Link>
              </div>
            ) : (
              receivedInvitations.map((inv) => {
                const isPending = inv.status === 'PENDING';
                return (
                  <div key={inv.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={inv.sender?.name} src={inv.sender?.avatarUrl} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {inv.sender?.name} <span className="font-normal text-gray-500">invited you to join</span>
                          </p>
                          <p className="text-xs text-gray-400">Role: <strong className="text-gray-700">{inv.roleName}</strong></p>
                        </div>
                      </div>

                      <Link to={`/projects/${inv.projectId}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors block mb-2">
                        {inv.project?.title}
                      </Link>

                      {inv.message && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                          "{inv.message}"
                        </p>
                      )}

                      <span className="text-xs text-gray-400">
                        Received on {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {isPending ? (
                        <>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleDeclineInvite(inv.id)}
                            disabled={isProcessing}
                          >
                            Decline
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleAcceptInvite(inv.id)}
                            isLoading={isProcessing}
                          >
                            Accept & Join
                          </Button>
                        </>
                      ) : (
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          inv.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {inv.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Recommended For You Section */}
        {recommendedProjects.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-primary-50 via-white to-blue-50 p-6 rounded-3xl border border-primary-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary-600 text-white rounded-lg text-sm">✨</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Recommended Projects For You</h2>
                  <p className="text-xs text-gray-500">Based on your skills, goals, and availability preferences.</p>
                </div>
              </div>
              <Link to="/projects">
                <Button variant="ghost" size="sm">Explore All →</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
