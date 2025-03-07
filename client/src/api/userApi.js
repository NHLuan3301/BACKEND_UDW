import axios from "axios";

const API_URL = "http://localhost:5000";

// Lấy danh sách user
export const getUsers = () => axios.get(`${API_URL}/api/users`);

// Thêm user mới
export const addUser = (user) => axios.post(`${API_URL}/api/users`, user);

// Cập nhật user
export const updateUser = (id, user) => axios.put(`${API_URL}/api/users/${id}`, user);

// Xóa user
export const deleteUser = (id) => axios.delete(`${API_URL}/api/users/${id}`);

//đăng ký
export const registerUser = (user) => axios.post(`${API_URL}/api/users/register`, user);

// Đăng nhập user
export const loginUser = (user) => axios.post(`${API_URL}/api/users/login`, user);