import api from './api';

export const getStoriesByProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/stories`);
  return response.data;
};

export const createStory = async (projectId, storyData) => {
  const response = await api.post(`/projects/${projectId}/stories`, storyData);
  return response.data;
};

export const updateStoryStatus = async (projectId, storyId, status) => {
  const response = await api.put(`/projects/${projectId}/stories/${storyId}/status`, { status });
  return response.data;
};
