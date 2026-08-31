import api from './api';

export const createProject = async (data) => {
  const res = await api.post('/projects', data);
  return res.data;
};

export const getProjects = async (params = {}) => {
  const res = await api.get('/projects', { params });
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

export const applyToProject = async (id, message) => {
  const res = await api.post(`/projects/${id}/apply`, { message });
  return res.data;
};

export const getProjectApplications = async (id) => {
  const res = await api.get(`/projects/${id}/applications`);
  return res.data;
};

export const acceptApplication = async (applicationId) => {
  const res = await api.put(`/projects/applications/${applicationId}/accept`);
  return res.data;
};

export const rejectApplication = async (applicationId) => {
  const res = await api.put(`/projects/applications/${applicationId}/reject`);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await api.get('/projects/my/applications');
  return res.data;
};
