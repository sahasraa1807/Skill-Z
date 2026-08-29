import api from './api';

export const getAllSkills = async () => {
  const res = await api.get('/skills');
  return res.data;
};

export const getAllInterests = async () => {
  const res = await api.get('/interests');
  return res.data;
};
