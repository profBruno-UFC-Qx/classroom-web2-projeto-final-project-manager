import api from "../axios";

export const TaskService = {
  async listBySprint(sprintId) {
    const response = await api.get("/tasks", { params: { sprintId } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/tasks/${id}`);
  },
};
