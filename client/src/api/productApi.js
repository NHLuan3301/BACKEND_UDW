import axios from "axios";

const API_URL = "http://localhost:5000";

// Lấy danh sách sản phẩm
export const getProducts = () => axios.get(`${API_URL}/api/products`);

//phan trang
export const getProductsSearch = (
  page = 1,
  limit = 10,
  sortBy = "name",
  order = "asc",
  keyword
) => {
  return axios.get(`${API_URL}/api/products/search`, {
    params: {
      page,
      limit,
      sortBy,
      order,
      keyword
    },
  });
};
// Thêm sản phẩm mới
export const addProduct = (product) =>
  axios.post(`${API_URL}/api/products`, product);

// Cập nhật thông tin sản phẩm
export const updateProduct = (id, product) =>
  axios.put(`${API_URL}/api/products/${id}`, product);

// Xóa sản phẩm
export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/api/products/${id}`);

// Tìm kiếm sản phẩm theo từ khóa
export const searchProduct = (keyword) =>
  axios.get(`${API_URL}/api/products/search?keyword=${keyword}`);
