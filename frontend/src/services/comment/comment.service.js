import api from "../axios";

export const CommentService = {
  async listByTask(taskId) {
    const response = await api.get("/comments", { params: { taskId } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/comments", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/comments/${id}`);
  },
};
