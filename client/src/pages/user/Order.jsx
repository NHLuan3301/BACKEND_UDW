import React, { useEffect, useState } from "react";
import {
  deleteAllCarts,
  deleteCart,
  searchCartsByUserId,
  updateCart,
} from "../../api/cartApi";
import { addOrder } from "../../api/orderApi";

export default function Order() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const storedUser = localStorage.getItem("data");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchCart(parsedUser._id);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await searchCartsByUserId(userId);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCart(id);
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCart(id, { quantity });
      setCartItems(
        cartItems.map((item) =>
          item._id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleOrder = async () => {
    const storedUser = localStorage.getItem("data");
    if (!storedUser) return alert("Vui lòng đăng nhập!");

    const parsedUser = JSON.parse(storedUser);
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const orderData = {
      userId: parsedUser._id,
      products: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      paymentMethod,
      totalAmount,
      orderDate: new Date(),
    };
    try {
      await addOrder(orderData);
      await deleteAllCarts();
      alert("Đặt hàng thành công!");
      setCartItems([]);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại!");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Đơn Hàng Của Bạn
        </h1>
        {cartItems.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="flex items-center py-3 space-x-4">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold truncate w-40">
                      {item.productId.name}
                    </h2>
                    <p className="text-gray-500 text-sm truncate w-40">
                      {item.productId.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-red-500 font-bold">
                    {item.productId.price}₫
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 items-center">
              <span className="text-2xl font-bold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-red-500">
                {cartItems.reduce(
                  (total, item) => total + item.productId.price * item.quantity,
                  0
                )}
                ₫
              </span>
            </div>

            {/* Chọn phương thức thanh toán */}
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold">
                Phương thức thanh toán:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
              >
                <option value="COD">Thanh toán khi nhận hàng</option>
                <option value="CreditCard">Thẻ tín dụng</option>
                <option value="Momo">Ví Momo</option>
                <option value="BankTransfer">Chuyển khoản ngân hàng</option>
              </select>
            </div>

            <button
              onClick={handleOrder}
              className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-lg font-semibold"
            >
              Xác nhận đặt hàng
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-center">Bạn chưa có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}
