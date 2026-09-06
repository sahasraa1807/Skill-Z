import api from './api';

export const searchProjectsSemantically = async (query, limit = 10) => {
  const res = await api.get(`/ai/search/projects?q=${encodeURIComponent(query)}&limit=${limit}`);
  return res.data;
};

export const searchPeopleSemantically = async (query, limit = 10) => {
  const res = await api.get(`/ai/search/people?q=${encodeURIComponent(query)}&limit=${limit}`);
  return res.data;
};

export const analyzeProject = async (data) => {
  const res = await api.post('/ai/analyze-project', data);
  return res.data;
};
