import { useState, useEffect } from 'react';
import { getUserProfile, getProfileConfidence } from '../services/userService';

export function useProfile(username, isOwnProfile = false) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserProfile(username);
        const profileData = data.data;

        // If own profile, also fetch confidence
        if (isOwnProfile) {
          try {
            const confData = await getProfileConfidence();
            profileData.confidence = confData.data;
          } catch {
            // Confidence fetch failure is non-fatal
          }
        }

        setProfile(profileData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [username, isOwnProfile]);

  return { profile, isLoading, error };
}
