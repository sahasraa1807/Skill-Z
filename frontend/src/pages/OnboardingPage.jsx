import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StepIndicator from '../components/onboarding/StepIndicator';
import StepBasicInfo from '../components/onboarding/StepBasicInfo';
import StepSkills from '../components/onboarding/StepSkills';
import StepInterests from '../components/onboarding/StepInterests';
import StepGoals from '../components/onboarding/StepGoals';
import StepAvailability from '../components/onboarding/StepAvailability';
import StepExperience from '../components/onboarding/StepExperience';
import { getAllSkills, getAllInterests } from '../services/skillService';
import { 
  updateProfile, 
  addSkill, 
  setInterests, 
  setGoals, 
  updatePreferences, 
  updateOnboardingStep, 
  completeOnboarding 
} from '../services/userService';

const STEPS = ['Basic Info', 'Skills', 'Interests', 'Goals', 'Availability', 'Experience'];

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [allSkills, setAllSkills] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  
  const [userData, setUserData] = useState({
    basicInfo: { name: user?.name || '', username: '', bio: '', location: '' },
    skills: [],
    interests: [],
    goals: [],
    availability: { availabilityHours: 10, preferWeekdays: false, preferWeekends: false, preferEvenings: false, preferMornings: false },
    experience: { experienceLevel: '', githubUrl: '', portfolioUrl: '', linkedinUrl: '' }
  });

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate(`/profile/${user.username}`);
      return;
    }
    
    if (user?.onboardingStep) {
      setCurrentStep(user.onboardingStep);
    }

    const fetchData = async () => {
      try {
        const [skillsRes, interestsRes] = await Promise.all([
          getAllSkills().catch(() => ({ data: [] })),
          getAllInterests().catch(() => ({ data: [] }))
        ]);
        setAllSkills(skillsRes.data || []);
        setAllInterests(interestsRes.data || []);
      } catch (err) {
        console.error('Error fetching onboarding data', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  const handleNext = async (stepData) => {
    setError('');
    setIsSaving(true);
    
    try {
      if (currentStep === 0) {
        setUserData(prev => ({ ...prev, basicInfo: stepData }));
        await updateProfile(stepData);
        updateUser({ name: stepData.name, username: stepData.username });
      } 
      else if (currentStep === 1) {
        setUserData(prev => ({ ...prev, skills: stepData }));
        // In real app, we might need to delete old ones first, but for onboarding we just add
        for (const skill of stepData) {
          await addSkill({ skillId: skill.skillId, proficiencyLevel: skill.proficiencyLevel });
        }
      }
      else if (currentStep === 2) {
        setUserData(prev => ({ ...prev, interests: stepData }));
        // Map interest names to IDs from the allInterests list
        const interestIds = stepData
          .map(name => {
            const found = allInterests.find(i => i.name === name);
            return found ? found.id : null;
          })
          .filter(Boolean); // remove nulls (interests not found in DB)
        if (interestIds.length > 0) {
          await setInterests(interestIds);
        }
      }
      else if (currentStep === 3) {
        setUserData(prev => ({ ...prev, goals: stepData }));
        await setGoals(stepData);
      }
      else if (currentStep === 4) {
        setUserData(prev => ({ ...prev, availability: stepData }));
        await updatePreferences(stepData);
      }
      else if (currentStep === 5) {
        setUserData(prev => ({ ...prev, experience: stepData }));
        await updatePreferences(stepData);
        
        await completeOnboarding();
        updateUser({ onboardingCompleted: true });
        navigate(`/profile/${userData.basicInfo.username || user.username}`);
        return;
      }
      
      await updateOnboardingStep(currentStep + 1);
      updateUser({ onboardingStep: currentStep + 1 });
      setCurrentStep(prev => prev + 1);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  if (isLoading) return <LoadingSpinner fullPage message="Loading setup..." />;

  return (
    <PageWrapper className="max-w-2xl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} stepLabels={STEPS} />
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        {currentStep === 0 && (
          <StepBasicInfo 
            initialData={userData.basicInfo} 
            onNext={handleNext} 
            isLoading={isSaving} 
          />
        )}
        
        {currentStep === 1 && (
          <StepSkills 
            initialSkills={userData.skills} 
            allSkills={allSkills} 
            onNext={handleNext} 
            onBack={handleBack} 
            isLoading={isSaving} 
          />
        )}
        
        {currentStep === 2 && (
          <StepInterests 
            initialInterests={userData.interests} 
            allInterests={allInterests} 
            onNext={handleNext} 
            onBack={handleBack} 
            isLoading={isSaving} 
          />
        )}
        
        {currentStep === 3 && (
          <StepGoals 
            initialGoals={userData.goals} 
            onNext={handleNext} 
            onBack={handleBack} 
            isLoading={isSaving} 
          />
        )}
        
        {currentStep === 4 && (
          <StepAvailability 
            initialData={userData.availability} 
            onNext={handleNext} 
            onBack={handleBack} 
            isLoading={isSaving} 
          />
        )}
        
        {currentStep === 5 && (
          <StepExperience 
            initialData={userData.experience} 
            onNext={handleNext} 
            onBack={handleBack} 
            isLoading={isSaving} 
          />
        )}
      </div>
    </PageWrapper>
  );
}
