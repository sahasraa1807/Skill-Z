import api from './api';

export const addProjectProof = async (data) => {
  const res = await api.post('/proofs', data);
  return res.data;
};

export const getUserProofs = async (username) => {
  const res = await api.get(`/proofs/user/${encodeURIComponent(username)}`);
  return res.data;
};

export const deleteProjectProof = async (id) => {
  const res = await api.delete(`/proofs/${id}`);
  return res.data;
};

export const verifySkillsFromGitHub = async () => {
  const res = await api.post('/proofs/verify-github');
  return res.data;
};
