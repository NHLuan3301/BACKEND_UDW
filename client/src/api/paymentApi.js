import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

// Lấy danh sách thanh toán
export const getPayments = () => axios.get(`${API_URL}/`);

// Tìm kiếm thanh toán theo OrderId
export const searchPaymentsByOrderId = (orderId) => axios.get(`${API_URL}/search`, { params: { orderId } });

// Thêm thanh toán mới
export const addPayment = (payment) => axios.post(`${API_URL}/`, payment);

// Cập nhật thanh toán
export const updatePayment = (id, updatedPayment) => axios.put(`${API_URL}/${id}`, updatedPayment);

// Xóa thanh toán
export const deletePayment = (id) => axios.delete(`${API_URL}/${id}`);