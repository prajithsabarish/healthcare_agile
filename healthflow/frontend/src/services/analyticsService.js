import api from './api';

export const getProjectVelocity = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/analytics/velocity`);
  return response.data;
};

export const getSprintBurndown = async (projectId, sprintId) => {
  const response = await api.get(`/projects/${projectId}/analytics/sprints/${sprintId}/burndown`);
  return response.data;
};
