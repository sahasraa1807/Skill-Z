import api from './api';

export const getProjectTeamIntelligence = async (projectId) => {
  const res = await api.get(`/team-intelligence/project/${projectId}`);
  return res.data;
};
