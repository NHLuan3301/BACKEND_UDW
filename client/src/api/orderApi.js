import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Lấy danh sách đơn hàng
export const getOrders = () => axios.get(`${API_URL}/`);

// Tìm kiếm đơn hàng theo UserId
export const searchOrdersByUserId = (userId) => axios.get(`${API_URL}/search`, { params: { userId } });

// Thêm đơn hàng mới
export const addOrder = (order) => axios.post(`${API_URL}/`, order);

// Cập nhật đơn hàng
export const updateOrder = (id, updatedOrder) => axios.put(`${API_URL}/${id}`, updatedOrder);

// Xóa đơn hàng
export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);