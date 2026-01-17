import api from "../axios"

export const ProjectService = {
  async list() {
    const response = await api.get('/projects')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  async listMembers(projectId) {
    const response = await api.get(`/projects/${projectId}/members`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/projects/${id}`);
  },
}
