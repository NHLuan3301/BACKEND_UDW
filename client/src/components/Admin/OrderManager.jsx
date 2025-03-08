import React, { useEffect, useState } from "react";
import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../../api/orderApi";
import { getUsers } from "../../api/userApi";
import { getProducts } from "../../api/productApi";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  console.log(orders);

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({
    userId: "",
    totalAmount: "",
    paymentMethod: "",
    status: "",
    orderDate: "",
    products: {
      productId: "",
      quantity: 1,
    },
  });
  const [editOrder, setEditOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(); // Hàm lấy danh sách người dùng
        setUsers(response.data);
        const rs = await getProducts();
        setProducts(rs.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };
    fetchUsers();
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };
  const handleAddOrder = async () => {
    try {
      await addOrder(newOrder);
      fetchOrders();
      setNewOrder({ userId: "", totalAmount: "", status: "" });
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi thêm đơn hàng:", error);
    }
  };
  const handleEditOrder = async () => {
    try {
      await updateOrder(editOrder._id, editOrder);
      fetchOrders();
      setEditOrder(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
    }
  };
  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderToDelete._id);
      fetchOrders();
      setOrderToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Quản lý đơn hàng</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addOrderModal"
        >
          Thêm đơn hàng
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order._id}</td>
              <td>{order.userId.username}</td>
              <td>
                {order.products.map((item, index) => (
                  <div key="index">
                    {index}: {item.productId.name}
                  </div>
                ))}
              </td>
              <td>{order.totalAmount}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.status}</td>
              <td>{order.orderDate}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editOrderModal"
                  onClick={() => setEditOrder(order)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteOrderModal"
                  onClick={() => setOrderToDelete(order)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Thêm Đơn Hàng */}
      <div className="modal fade" id="addOrderModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm đơn hàng</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">USER ID</label>
                <select
                  className="form-control"
                  value={newOrder.userId}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, userId: e.target.value })
                  }
                >
                  <option value="">Chọn người dùng</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} {/* Hoặc trường bạn muốn hiển thị */}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Product</label>
                <select
                  className="form-control"
                  value={newOrder?.products?.productId}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      products: {
                        ...newOrder.products, // Giữ nguyên các giá trị cũ trong products
                        productId: e.target.value, // Cập nhật productId
                      },
                    })
                  }
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} {/* Hoặc trường bạn muốn hiển thị */}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newOrder.products.quantity}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      products: {
                        ...newOrder.products, // Giữ nguyên các giá trị cũ trong products
                        quantity: e.target.value, // Cập nhật productId
                      },
                    })
                  }
                />
              </div>
              {["totalAmount", "paymentMethod", "status", "orderDate"].map(
                (field) => (
                  <div className="mb-2" key={field}>
                    <label className="form-label">{field.toUpperCase()}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newOrder[field]}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, [field]: e.target.value })
                      }
                    />
                  </div>
                )
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleAddOrder}
                data-bs-dismiss="modal"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa Đơn Hàng */}
      <div className="modal fade" id="editOrderModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa đơn hàng</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {editOrder &&
                ["userId", "totalAmount", "status"].map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="form-label">{field.toUpperCase()}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editOrder[field]}
                      onChange={(e) =>
                        setEditOrder({ ...editOrder, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleEditOrder}
                data-bs-dismiss="modal"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xóa Đơn Hàng */}
      <div className="modal fade" id="deleteOrderModal" tabIndex="-1">
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
              Bạn có chắc chắn muốn xóa đơn hàng này không?
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={handleDeleteOrder}
                data-bs-dismiss="modal"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
