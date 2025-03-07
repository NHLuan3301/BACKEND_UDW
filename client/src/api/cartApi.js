import axios from "axios";

const API_URL = "http://localhost:5000/api/carts";

// Lấy danh sách giỏ hàng
export const getCarts = () => axios.get(`${API_URL}/`);

// Tìm kiếm giỏ hàng theo UserId
export const searchCartsByUserId = (userId) => axios.get(`${API_URL}/search`, { params: { userId } });

// Thêm giỏ hàng mới
export const addCart = (cart) => axios.post(`${API_URL}/`, cart);

// Cập nhật giỏ hàng
export const updateCart = (id, updatedCart) => axios.put(`${API_URL}/${id}`, updatedCart);

// Xóa giỏ hàng
export const deleteCart = (id) => axios.delete(`${API_URL}/${id}`);

// Xóa tất cả giỏ hàng
export const deleteAllCarts = () => axios.delete(`${API_URL}/`);