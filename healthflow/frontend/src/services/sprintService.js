import api from './api';

export const getSprintsByProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/sprints`);
  return response.data;
};

export const createSprint = async (projectId, sprintData) => {
  const response = await api.post(`/projects/${projectId}/sprints`, sprintData);
  return response.data;
};
