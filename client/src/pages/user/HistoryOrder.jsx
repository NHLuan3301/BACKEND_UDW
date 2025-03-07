import React, { useEffect, useState } from "react";
import { searchOrdersByUserId } from "../../api/orderApi";

export default function HistoryOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const storedUser = localStorage.getItem("data");
                if (!storedUser) {
                    setError("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
                    return;
                }

                const parsedUser = JSON.parse(storedUser);
                const response = await searchOrdersByUserId(parsedUser._id);
                console.log(response);

                setOrders(response.data);
            } catch (err) {
                setError("Lỗi khi tải đơn hàng, vui lòng thử lại.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Lịch sử đơn hàng</h1>

                {loading && <p className="text-gray-600">Đang tải đơn hàng...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && orders.length === 0 && <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>}

                {orders.map((order) => (
                    <div key={order._id} className="border-b border-gray-300 py-4">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700"><strong>Mã đơn:</strong> {order._id}</p>
                            <span className={`px-3 py-1 rounded text-sm ${order.status === "Đã thanh toán" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}>
                                {order.status}
                            </span>
                        </div>

                        <p className="text-gray-700"><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p className="text-gray-700"><strong>Tổng tiền:</strong> <span className="text-red-500 font-bold">{order.totalAmount.toLocaleString()}₫</span></p>
                        <p className="text-gray-700"><strong>Thanh toán:</strong> {order.paymentMethod}</p>

                        <h3 className="font-semibold mt-2">Sản phẩm:</h3>
                        <ul className="bg-gray-50 p-3 rounded">
                            {order.products.map((item) => (
                                <li key={item.productId._id} className="flex items-center space-x-4 py-2 border-b">
                                    <img src={item.productId.image} alt={item.productId.name} className="w-16 h-16 object-cover rounded" />
                                    <div>
                                        <p className="text-gray-800 font-semibold">{item.productId.name}</p>
                                        <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                        <p className="text-red-500 font-bold">{item.productId.price.toLocaleString()}₫</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
