import api from "../axios";

export const SprintService = {
  async listByProject(projectId) {
    const response = await api.get("/sprints");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/sprints/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/sprints", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/sprints/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/sprints/${id}`);
  },
};
