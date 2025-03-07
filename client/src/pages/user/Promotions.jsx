import React from 'react';

const Promotions = () => {
    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-3xl font-bold mb-6 text-center">Khuyến mãi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Ví dụ sản phẩm khuyến mãi */}
                <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300">
                    <img
                        src="https://via.placeholder.com/300x200"
                        alt="Khuyến mãi 1"
                        className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">Khuyến mãi đặc biệt</h3>
                    <p className="text-gray-500 mb-2">Giảm giá 50% cho tất cả sản phẩm</p>
                    <p className="text-red-500 font-bold mb-4">Chỉ còn 500.000 VND</p>
                    <button className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
                        Mua ngay
                    </button>
                </div>
                {/* Thêm các sản phẩm khuyến mãi khác tại đây */}
            </div>
        </div>
    );
};

export default Promotions;