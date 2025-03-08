import React, { useEffect, useState } from "react";
import { searchCartsByUserId, deleteCart, updateCart } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("data");
    if (!storedUser) navigate("/login");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchCart(parsedUser._id);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await searchCartsByUserId(userId);
      const mergedCart = response.data.reduce((acc, item) => {
        const existingItem = acc.find(
          (i) => i.productId._id === item.productId._id
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      setCartItems(mergedCart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // xoa o db qua api
      await deleteCart(id);
      // set lai cart item trong giao dien
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      //goi api update cart o db
      await updateCart(id, { quantity });
      // set du lieu o giao dien
      setCartItems(
        cartItems.map((item) =>
          item._id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleCheckout = () => {
    navigate("/order");
  };

  return (
    <div className="min-h-screen bg-red-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <a
          href="/products"
          className="text-base text-black mb-4 text-left cursor-pointer"
        >
          Quay lại trang sản phẩm
        </a>
        <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Giỏ Hàng
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
            <div className="flex justify-end mt-4">
              <span className="text-2xl font-bold">Tổng cộng: </span>
              <span className="text-2xl font-bold text-red-500">
                {cartItems.reduce(
                  (total, item) => total + item.productId.price * item.quantity,
                  0
                )}
                ₫
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-lg font-semibold"
            >
              Đặt Hàng
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-center">
            Giỏ hàng của bạn đang trống.
          </p>
        )}
      </div>
    </div>
  );
}
