import api from "../axios";

export const UserService = {
  async listAll() {
    const response = await api.get("/users");
    return response.data;
  },

  async listAssignable() {
    const response = await api.get("/users/assignable");
    return response.data;
  },

  async getMe() {
    const { data } = await api.get("/me");
    return data;
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/users", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/users/${id}`);
  }
};
