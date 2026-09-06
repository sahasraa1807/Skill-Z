import api from './api';

export const getWorkspace = async (projectId) => {
  const res = await api.get(`/workspace/project/${projectId}`);
  return res.data;
};

export const createTask = async (projectId, data) => {
  const res = await api.post(`/workspace/project/${projectId}/tasks`, data);
  return res.data;
};

export const updateTask = async (taskId, updates) => {
  const res = await api.put(`/workspace/tasks/${taskId}`, updates);
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await api.delete(`/workspace/tasks/${taskId}`);
  return res.data;
};

export const addResource = async (projectId, data) => {
  const res = await api.post(`/workspace/project/${projectId}/resources`, data);
  return res.data;
};

export const deleteResource = async (resourceId) => {
  const res = await api.delete(`/workspace/resources/${resourceId}`);
  return res.data;
};

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put('/notifications/read-all');
  return res.data;
};
