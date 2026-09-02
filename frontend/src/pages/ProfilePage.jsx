import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProfileCard from '../components/profile/ProfileCard';
import SkillsList from '../components/profile/SkillsList';
import InterestsList from '../components/profile/InterestsList';
import ProfileConfidenceBadge from '../components/profile/ProfileConfidenceBadge';
import GitHubStatsCard from '../components/profile/GitHubStatsCard';
import { GOALS, EXPERIENCE_LEVELS } from '../utils/constants';

export default function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  
  const isOwnProfile = user?.username === username;
  const { profile, isLoading, error } = useProfile(username, isOwnProfile);
  
  if (isLoading) return <LoadingSpinner fullPage />;
  if (error || !profile) return <ErrorMessage message={error || 'Profile not found'} />;
  
  const experienceLabel = EXPERIENCE_LEVELS.find(e => e.value === profile.preferences?.experienceLevel)?.label || 'Not specified';
  const hours = profile.preferences?.availabilityHours || 0;

  
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
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
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
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {isOwnProfile && profile.confidence && (
            <ProfileConfidenceBadge confidence={profile.confidence} />
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
    </PageWrapper>
  );
}
