import api from './api';

export const sendInvitation = async (projectId, data) => {
  const res = await api.post(`/projects/${projectId}/invite`, data);
  return res.data;
};

export const getReceivedInvitations = async () => {
  const res = await api.get('/invitations/received');
  return res.data;
};

export const getSentInvitations = async () => {
  const res = await api.get('/invitations/sent');
  return res.data;
};

export const acceptInvitation = async (invitationId) => {
  const res = await api.put(`/invitations/${invitationId}/accept`);
  return res.data;
};

export const rejectInvitation = async (invitationId) => {
  const res = await api.put(`/invitations/${invitationId}/reject`);
  return res.data;
};
