import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { addCart } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
function HomePage() {
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

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };
  const handleAddProductToCard = async (product) => {
    try {
      await addCart({ userId: user._id, productId: product._id, quantity: 1 });
      alert("Thêm sản phẩm thành công!");
      navigate("/cart");
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm với giỏ hàng!");
      console.error("Lỗi", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Banner khuyến mãi */}
      <section className="bg-red-500 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Khuyến mãi đặc biệt từ Viettel
          </h1>
          <p className="text-lg mb-6">
            Mua sắm ngay hôm nay để nhận ưu đãi lên đến 50%!
          </p>
          <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
            <a href="/products"> Mua ngay</a>
          </button>
        </div>
      </section>

      {/* Danh mục sản phẩm nổi bật */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Sản phẩm nổi bật
          </h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 mb-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2 truncate w-40">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2 truncate w-40">
                    {product.description}
                  </p>
                  <p className="text-red-600 font-bold mb-4">
                    {product.price} VND
                  </p>
                  <button
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    onClick={() => handleAddProductToCard(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Chân trang */}
      <footer className="bg-red-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Viettel. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-gray-200">
              Facebook
            </a>
            <a href="#" className="hover:text-gray-200">
              Twitter
            </a>
            <a href="#" className="hover:text-gray-200">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
