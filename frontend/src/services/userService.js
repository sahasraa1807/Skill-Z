import api from './api';

export const getUserProfile = async (username) => {
  const res = await api.get(`/users/profile/${username}`);
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put('/users/profile', data);
  return res.data;
};

export const updatePreferences = async (data) => {
  const res = await api.put('/users/preferences', data);
  return res.data;
};

export const updateOnboardingStep = async (step) => {
  const res = await api.put('/users/onboarding/step', { step });
  return res.data;
};

export const completeOnboarding = async () => {
  const res = await api.post('/users/onboarding/complete');
  return res.data;
};

export const getMySkills = async () => {
  const res = await api.get('/users/skills');
  return res.data;
};

export const addSkill = async ({ skillId, proficiencyLevel }) => {
  const res = await api.post('/users/skills', { skillId, proficiencyLevel });
  return res.data;
};

export const removeSkill = async (skillId) => {
  const res = await api.delete(`/users/skills/${skillId}`);
  return res.data;
};

export const updateSkill = async (skillId, proficiencyLevel) => {
  const res = await api.put(`/users/skills/${skillId}`, { proficiencyLevel });
  return res.data;
};

export const setInterests = async (interestIds) => {
  const res = await api.post('/users/interests', { interestIds });
  return res.data;
};

export const getMyInterests = async () => {
  const res = await api.get('/users/interests');
  return res.data;
};

export const setGoals = async (goals) => {
  const res = await api.post('/users/goals', { goals });
  return res.data;
};

export const getMyGoals = async () => {
  const res = await api.get('/users/goals');
  return res.data;
};

export const getProfileConfidence = async () => {
  const res = await api.get('/users/confidence');
  return res.data;
};

export const getCandidates = async (params = {}) => {
  const res = await api.get('/users', { params });
  return res.data;
};

export const getDashboard = async () => {
  const res = await api.get('/users/dashboard');
  return res.data;
};

