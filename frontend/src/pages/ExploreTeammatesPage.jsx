import { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import CandidateCard from '../components/people/CandidateCard';
import InviteModal from '../components/people/InviteModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { getCandidates } from '../services/userService';
import { getAllSkills } from '../services/skillService';
import { sendInvitation } from '../services/invitationService';
import { getProjects } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { EXPERIENCE_LEVELS } from '../utils/constants';

export default function ExploreTeammatesPage() {
  const { user, isAuthenticated } = useAuth();

  const [candidates, setCandidates] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedExp, setSelectedExp] = useState('');
  const [minHours, setMinHours] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Invite Modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Skills once on mount
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const skillsRes = await getAllSkills();
        setAllSkills(skillsRes.data || []);
      } catch (err) {
        console.error('Failed to load skills:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch user's owned recruiting projects for inviting
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchMyProjects = async () => {
        try {
          const res = await getProjects({ status: 'RECRUITING', limit: 50 });
          // Filter to only projects owned by current user
          const myOwned = (res.data?.projects || []).filter(p => p.owner?.id === user.id || p.ownerId === user.id);
          setOwnedProjects(myOwned);
        } catch (err) {
          console.error('Failed to load owned projects:', err);
        }
      };
      fetchMyProjects();
    }
  }, [isAuthenticated, user]);

  // Fetch candidates on filter/page change
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getCandidates({
          search: search.trim() || undefined,
          skill: selectedSkill || undefined,
          experienceLevel: selectedExp || undefined,
          minHours: minHours || undefined,
          page,
          limit: 9
        });
        
        setCandidates(res.data?.candidates || []);
        setTotalPages(res.data?.totalPages || 1);
        setTotalCount(res.data?.total || 0);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load candidates');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCandidates();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [search, selectedSkill, selectedExp, minHours, page]);

  const handleOpenInvite = (candidate) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setActiveCandidate(candidate);
    setInviteModalOpen(true);
  };

  const handleSendInvite = async (data) => {
    setIsSendingInvite(true);
    try {
      await sendInvitation(data.projectId, {
        receiverId: data.receiverId,
        roleName: data.roleName,
        message: data.message
      });
      setInviteModalOpen(false);
      setToastMessage(`Invitation sent to ${activeCandidate.name}!`);
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSkill('');
    setSelectedExp('');
    setMinHours('');
    setPage(1);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Teammates</h1>
            <p className="text-gray-600 mt-1">Discover talented builders, developers, and designers for your next project.</p>
          </div>
          {isAuthenticated && (
            <Button variant="primary" onClick={() => window.location.href = '/projects/create'}>
              + Post a Project
            </Button>
          )}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium flex items-center justify-between animate-in fade-in">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, username, bio or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Skill Filter */}
            <div className="w-full md:w-52">
              <select
                value={selectedSkill}
                onChange={(e) => { setSelectedSkill(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">All Skills</option>
                {allSkills.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedExp}
                onChange={(e) => { setSelectedExp(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">Any Experience</option>
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp.value} value={exp.value}>{exp.label}</option>
                ))}
              </select>
            </div>

            {/* Minimum Availability Hours */}
            <div className="w-full md:w-44">
              <select
                value={minHours}
                onChange={(e) => { setMinHours(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">Any Availability</option>
                <option value="5">5+ hrs / week</option>
                <option value="10">10+ hrs / week</option>
                <option value="15">15+ hrs / week</option>
                <option value="20">20+ hrs / week</option>
              </select>
            </div>

            {(search || selectedSkill || selectedExp || minHours) && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="self-center">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Showing <span className="font-semibold text-gray-800">{candidates.length}</span> of <span className="font-semibold text-gray-800">{totalCount}</span> builders</p>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <LoadingSpinner fullPage={false} message="Finding teammates..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => setPage(1)} />
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No teammates found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Try adjusting your filters or search keywords to discover more candidate profiles.</p>
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((cand) => (
              <CandidateCard
                key={cand.id}
                candidate={cand}
                currentUserId={user?.id}
                onInvite={handleOpenInvite}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={page <= 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              ← Previous
            </Button>
            <span className="text-sm text-gray-600 font-medium px-2">
              Page {page} of {totalPages}
            </span>
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next →
            </Button>
          </div>
        )}

        {/* Invite to Project Modal */}
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          candidate={activeCandidate}
          ownedProjects={ownedProjects}
          onSend={handleSendInvite}
          isLoading={isSendingInvite}
        />

      </div>
    </PageWrapper>
  );
}
