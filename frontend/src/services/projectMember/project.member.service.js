import api from "../axios";

export const ProjectMemberService = {
  async listByProject(projectId) {
    const response = await api.get(`/members/${projectId}`);
    return response.data;
  },

  async listMyProjects() {
    const response = await api.get("/members/me/projects");
    return response.data;
  },

  async listAvailable(projectId) {
    const response = await api.get(`/members/${projectId}/available`);
    return response.data;
  },

  async add(projectId, data) {
    const response = await api.post(`/members/${projectId}`, data);
    return response.data;
  },

  async update(projectId, userId, data) {
    const response = await api.put(`/members/${projectId}/${userId}`, data);
    return response.data;
  },

  async delete(projectId, userId) {
    await api.delete(`/members/${projectId}/${userId}`);
  },
};
