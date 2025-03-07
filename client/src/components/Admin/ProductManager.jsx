import { useState, useEffect } from "react";
import {
  getProductsSearch,
  searchProduct,
  deleteProduct,
  addProduct,
  updateProduct,
} from "../../api/productApi";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    stock: 0,
    description: "",
  });
  const [editProduct, setEditProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsSearch(
          page,
          limit,
          sortBy,
          order,
          keyword
        );
        setProducts(response.data);
        console.log(response);

        setTotalPages(products.length < limit ? page : page + 1);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, [page, sortBy, order, keyword, limit]);

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setNewProduct({
        name: "",
        price: "",
        image: "",
        category: "",
        stock: 0,
        description: "",
      });
      setPage(1);
      const response = await getProductsSearch(
        page,
        limit,
        sortBy,
        order,
        keyword
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  const handleEditProduct = async () => {
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, editProduct);
        setEditProduct(null);
        const response = await getProductsSearch(
          page,
          limit,
          sortBy,
          order,
          keyword
        );
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (productToDelete) {
        await deleteProduct(productToDelete._id);
        setProducts(products.filter((p) => p._id !== productToDelete._id));
        setProductToDelete(null);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mt-4 max-h-screen">
      <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 bg-light rounded shadow-sm">
        {/* Ô tìm kiếm */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-search"></i>
          <input
            type="text"
            className="form-control"
            style={{ width: "250px" }}
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Nút thêm sản phẩm */}
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          <i className="bi bi-plus-lg"></i> Thêm sản phẩm
        </button>

        {/* Dropdown sắp xếp */}
        <div className="d-flex gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-sort-up"></i>
            <select
              className="form-select"
              style={{ width: "150px" }}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-funnel"></i>
            <select
              className="form-select"
              style={{ width: "150px" }}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Tên</option>
              <option value="price">Giá</option>
              <option value="stock">Stock</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-funnel"></i>
            <select
              className="form-select"
              style={{ width: "150px" }}
              onChange={(e) => setLimit(e.target.value)}
            >
              <option value="">Giới hạn trên 1 trang</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
            <th>Stock</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, key) => (
            <tr key={key}>
              <td>{product.name}</td>
              <td>
                <img src={product.image} alt="" width={50} height={50} />
              </td>
              <td>{product.price}đ</td>
              <td>{product.stock}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editProductModal"
                  onClick={() => setEditProduct(product)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteProductModal"
                  onClick={() => setProductToDelete(product)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Thêm sản phẩm */}
      <div className="modal fade" id="addProductModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm sản phẩm</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên sản phẩm"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Giá sản phẩm</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Nhập giá sản phẩm"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  min={1}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">URL hình ảnh</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập URL hình ảnh"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Số lượng trong kho</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Nhập số lượng"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  min={1}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea
                  className="form-control"
                  placeholder="Nhập mô tả sản phẩm"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleAddProduct}
                data-bs-dismiss="modal"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa sản phẩm */}
      <div className="modal fade" id="editProductModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="" className="form-label">
                Tên sản phẩm
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Tên sản phẩm"
                value={editProduct?.name || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
              <label htmlFor="" className="form-label">
                Giá
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Giá"
                value={editProduct?.price || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
              <label htmlFor="" className="form-label">
                Số lượng
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Số lượng"
                value={editProduct?.stock || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, stock: e.target.value })
                }
              />
              <label htmlFor="" className="form-label">
                URL hình ảnh
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="URL hình ảnh"
                value={editProduct?.image || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.value })
                }
              />
              <label htmlFor="" className="form-label">
                Mô tả
              </label>
              <textarea
                className="form-control"
                placeholder="Mô tả"
                value={editProduct?.description || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleEditProduct}
                data-bs-dismiss="modal"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xóa sản phẩm */}
      <div className="modal fade" id="deleteProductModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              Bạn có chắc chắn muốn xóa sản phẩm này không?
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={handleDeleteProduct}
                data-bs-dismiss="modal"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="primary btn"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          className="primary btn"
          disabled={page === limit}
          onClick={() => handlePageChange(page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ProductManager;
