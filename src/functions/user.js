import api from "../api/axiosInstance";

export const getAllUsers = async () => {
    return await api.get("/users");
};

export const getUser = async (id) => {
    return await api.get(`/users/${id}`);
};

export const createUser = async (userData) => {
    return await api.post("/users/create", userData);
};

export const updateUser = async (id, userData) => {
    return await api.patch(`/users/${id}`, userData);
};

export const deleteUser = async (id) => {
    return await api.delete(`/users/${id}`);
};
