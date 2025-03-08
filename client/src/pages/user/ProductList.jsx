import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { addCart } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("data");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleAddProductToCard = async (product) => {
    try {
      await addCart({ userId: user._id, productId: product._id, quantity: 1 });
      alert("Thêm sản phẩm thành công!");
      // navigate("/cart");
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm với giỏ hàng!");
      console.error("Lỗi", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Danh sách sản phẩm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 truncate w-40">
              {product.name}
            </h3>
            <p className="text-gray-500 mb-2 truncate w-40">
              {product.description}
            </p>
            <p className="text-red-500 font-bold mb-4">{product.price} VND</p>
            <button
              onClick={() => handleAddProductToCard(product)}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
