import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import ProfileCard from '../components/profile/ProfileCard';
import SkillsList from '../components/profile/SkillsList';
import InterestsList from '../components/profile/InterestsList';
import ProfileConfidenceBadge from '../components/profile/ProfileConfidenceBadge';
import GitHubStatsCard from '../components/profile/GitHubStatsCard';
import ProjectProofCard from '../components/profile/ProjectProofCard';
import AddProofModal from '../components/profile/AddProofModal';
import { getUserProofs, addProjectProof, deleteProjectProof, verifySkillsFromGitHub } from '../services/proofService';
import { getProfileConfidence } from '../services/userService';
import { GOALS, EXPERIENCE_LEVELS } from '../utils/constants';

export default function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  
  const isOwnProfile = user?.username === username;
  const { profile, isLoading, error, refetch } = useProfile(username, isOwnProfile);

  const [proofs, setProofs] = useState([]);
  const [isProofsLoading, setIsProofsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingProof, setIsAddingProof] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confidenceData, setConfidenceData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch project proofs
  const fetchProofs = async () => {
    if (!username) return;
    try {
      const res = await getUserProofs(username);
      setProofs(res.data || []);
    } catch (err) {
      console.error('Failed to load project proofs', err);
    } finally {
      setIsProofsLoading(false);
    }
  };

  // Fetch updated confidence
  const fetchConfidence = async () => {
    if (!isOwnProfile) return;
    try {
      const res = await getProfileConfidence();
      setConfidenceData(res.data);
    } catch (err) {
      console.error('Failed to fetch confidence', err);
    }
  };

  useEffect(() => {
    fetchProofs();
    if (isOwnProfile) {
      fetchConfidence();
    }
  }, [username, isOwnProfile]);

  const handleAddProof = async (data) => {
    setIsAddingProof(true);
    try {
      await addProjectProof(data);
      setIsAddModalOpen(false);
      setToastMessage('Project proof added! Confidence boosted.');
      setTimeout(() => setToastMessage(''), 4000);
      fetchProofs();
      fetchConfidence();
      if (refetch) refetch();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to add project proof');
    } finally {
      setIsAddingProof(false);
    }
  };

  const handleDeleteProof = async (proofId) => {
    if (!window.confirm('Delete this project proof?')) return;
    try {
      await deleteProjectProof(proofId);
      setToastMessage('Project proof removed.');
      setTimeout(() => setToastMessage(''), 4000);
      fetchProofs();
      fetchConfidence();
      if (refetch) refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete proof');
    }
  };

  const handleVerifyGitHub = async () => {
    setIsVerifying(true);
    try {
      const res = await verifySkillsFromGitHub();
      const count = res.data?.verifiedCount || 0;
      setToastMessage(`GitHub scan complete! ${count} skills now verified.`);
      setTimeout(() => setToastMessage(''), 4000);
      fetchConfidence();
      if (refetch) refetch();
      // Reload page data to refresh skills list
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to verify skills via GitHub');
    } finally {
      setIsVerifying(false);
    }
  };
  
  if (isLoading) return <LoadingSpinner fullPage />;
  if (error || !profile) return <ErrorMessage message={error || 'Profile not found'} />;
  
  const experienceLabel = EXPERIENCE_LEVELS.find(e => e.value === profile.preferences?.experienceLevel)?.label || 'Not specified';
  const hours = profile.preferences?.availabilityHours || 0;
  const activeConfidence = confidenceData || profile.confidence;

  const renderGoals = () => {
    if (!profile.goals || profile.goals.length === 0) return <p className="text-sm text-gray-400 italic">No goals specified.</p>;
    return (
      <ul className="list-disc list-inside text-sm text-gray-700 flex flex-col gap-1">
        {profile.goals.map(g => {
          const label = GOALS.find(x => x.value === g.goal)?.label || g.goal;
          return <li key={g.goal}>{label}</li>;
        })}
      </ul>
    );
  };
  
  const renderAvailability = () => {
    const prefs = profile.preferences;
    if (!prefs) return <p className="text-sm text-gray-400 italic">No availability specified.</p>;
    
    const times = [];
    if (prefs.preferWeekdays) times.push('Weekdays');
    if (prefs.preferWeekends) times.push('Weekends');
    if (prefs.preferMornings) times.push('Mornings');
    if (prefs.preferEvenings) times.push('Evenings');
    
    return (
      <div className="text-sm text-gray-700 flex flex-col gap-2">
        <p><strong>Hours per week:</strong> {hours}</p>
        <p><strong>Experience Level:</strong> {experienceLabel}</p>
        {times.length > 0 && <p><strong>Preferred times:</strong> {times.join(', ')}</p>}
      </div>
    );
  };

  return (
    <PageWrapper>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm font-medium flex items-center justify-between animate-in fade-in">
          <span>✨ {toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
            {isOwnProfile && (
              <Link 
                to="/profile/edit" 
                className="absolute top-6 right-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
            )}
            <ProfileCard user={profile} />
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skills */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Technical Skills</h2>
                {isOwnProfile && profile.preferences?.githubUrl && (
                  <button
                    type="button"
                    onClick={handleVerifyGitHub}
                    disabled={isVerifying}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    title="Scan public GitHub repos to verify skills"
                  >
                    <span>🛡️</span> {isVerifying ? 'Scanning...' : 'Verify with GitHub'}
                  </button>
                )}
              </div>
              <SkillsList skills={profile.skills} />
            </div>
            
            {/* Interests */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Interests</h2>
              <InterestsList interests={profile.interests} />
            </div>
            
            {/* Goals */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Goals</h2>
              {renderGoals()}
            </div>
            
            {/* Availability */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Availability & Experience</h2>
              {renderAvailability()}
            </div>
            
          </div>

          {/* Phase 5: Public Project Evidence Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>📁</span> Project Evidence & Proofs
                </h2>
                <p className="text-xs text-gray-500">Documented projects backing self-reported skills and builder credibility.</p>
              </div>
              {isOwnProfile && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsAddModalOpen(true)}
                >
                  + Add Project Proof
                </Button>
              )}
            </div>

            {isProofsLoading ? (
              <LoadingSpinner message="Loading proofs..." />
            ) : proofs.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No public project proofs added yet.</p>
                {isOwnProfile && (
                  <p className="text-xs text-primary-600 mt-1 cursor-pointer font-medium" onClick={() => setIsAddModalOpen(true)}>
                    + Add a GitHub repository or live project demo to elevate your confidence
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proofs.map(proof => (
                  <ProjectProofCard 
                    key={proof.id} 
                    proof={proof} 
                    isOwnProfile={isOwnProfile}
                    onDelete={handleDeleteProof}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {isOwnProfile && activeConfidence && (
            <ProfileConfidenceBadge confidence={activeConfidence} />
          )}

          {profile.preferences?.githubUrl && (
            <GitHubStatsCard githubUrl={profile.preferences.githubUrl} />
          )}
          
          <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
            <h3 className="font-semibold text-primary-900 mb-2">Looking for a team?</h3>
            <p className="text-sm text-primary-700 mb-4">Browse projects that match your skills and interests.</p>
            <Link to="/projects" className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Find Projects
            </Link>
          </div>
        </div>
        
      </div>

      {/* Add Project Proof Modal */}
      {isAddModalOpen && (
        <AddProofModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProof}
          isLoading={isAddingProof}
        />
      )}
    </PageWrapper>
  );
}
