import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { 
  updateProfile, 
  updatePreferences 
} from '../services/userService';
import { EXPERIENCE_LEVELS } from '../utils/constants';

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const { profile, isLoading, error: profileError } = useProfile(user?.username);
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    availabilityHours: 10,
    preferWeekdays: false,
    preferWeekends: false,
    preferMornings: false,
    preferEvenings: false,
    experienceLevel: '',
    githubUrl: '',
    portfolioUrl: '',
    linkedinUrl: ''
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        availabilityHours: profile.preferences?.availabilityHours || 10,
        preferWeekdays: profile.preferences?.preferWeekdays || false,
        preferWeekends: profile.preferences?.preferWeekends || false,
        preferMornings: profile.preferences?.preferMornings || false,
        preferEvenings: profile.preferences?.preferEvenings || false,
        experienceLevel: profile.preferences?.experienceLevel || '',
        githubUrl: profile.preferences?.githubUrl || '',
        portfolioUrl: profile.preferences?.portfolioUrl || '',
        linkedinUrl: profile.preferences?.linkedinUrl || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    
    try {
      // Update basic info
      await updateProfile({
        name: form.name,
        bio: form.bio,
        location: form.location,
        username: profile.username // Keep existing
      });
      
      // Update preferences
      await updatePreferences({
        availabilityHours: Number(form.availabilityHours),
        preferWeekdays: form.preferWeekdays,
        preferWeekends: form.preferWeekends,
        preferMornings: form.preferMornings,
        preferEvenings: form.preferEvenings,
        experienceLevel: form.experienceLevel,
        githubUrl: form.githubUrl,
        portfolioUrl: form.portfolioUrl,
        linkedinUrl: form.linkedinUrl
      });
      
      updateUser({ name: form.name });
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        navigate(`/profile/${profile.username}`);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (profileError || !profile) return <ErrorMessage message={profileError || 'Profile not found'} />;

  return (
    <PageWrapper className="max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/profile/${profile.username}`)}>
            Cancel
          </Button>
        </div>
        
        <div className="p-6">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{success}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Basic Info */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Basic Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" id="name" value={form.name} onChange={handleChange} required />
                <Input label="Location" id="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  id="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </section>
            
            {/* Preferences */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Availability & Experience</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-700">Hours per week: {form.availabilityHours}</label>
                  <input
                    type="range" min={1} max={40} id="availabilityHours" value={form.availabilityHours}
                    onChange={handleChange}
                    className="w-full accent-primary-600"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Experience Level</label>
                  <select
                    id="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="" disabled>Select level</option>
                    {EXPERIENCE_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-gray-700 mb-1">Preferred Times</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" id="preferWeekdays" checked={form.preferWeekdays} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                    Weekdays
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" id="preferWeekends" checked={form.preferWeekends} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                    Weekends
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" id="preferMornings" checked={form.preferMornings} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                    Mornings
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" id="preferEvenings" checked={form.preferEvenings} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                    Evenings
                  </label>
                </div>
              </div>
            </section>
            
            {/* Links */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="GitHub URL" id="githubUrl" value={form.githubUrl} onChange={handleChange} />
                <Input label="LinkedIn URL" id="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} />
                <Input label="Portfolio URL" id="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} />
              </div>
            </section>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={() => navigate(`/profile/${profile.username}`)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
