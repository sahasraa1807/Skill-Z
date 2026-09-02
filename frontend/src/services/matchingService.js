import api from './api';

export const getProjectCompatibility = async (projectId) => {
  const res = await api.get(`/matching/projects/${projectId}/compatibility`);
  return res.data;
};

export const getRecommendedProjects = async (limit = 4) => {
  const res = await api.get(`/matching/recommended-projects?limit=${limit}`);
  return res.data;
};

export const getRecommendedCandidates = async (projectId, limit = 4) => {
  const res = await api.get(`/matching/projects/${projectId}/candidates?limit=${limit}`);
  return res.data;
};

export const getGitHubStats = async (username) => {
  const res = await api.get(`/matching/github/${encodeURIComponent(username)}`);
  return res.data;
};
