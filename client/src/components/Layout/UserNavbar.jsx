import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const UserNavbar = () => {
    const user = JSON.parse(localStorage.getItem("data"));
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-red-600 text-white p-4 flex justify-between items-center w-full">
            {/* Dropdown Menu Button */}
            <Link to="/" className="text-2xl font-bold">Viettel</Link>
            <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {menuOpen && (
                    <div className="absolute left-0 top-full bg-white text-black shadow-lg rounded-lg w-48 mt-2">
                        <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Trang chủ</Link>
                        <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">Sản phẩm</Link>
                        <Link to="/promotions" className="block px-4 py-2 hover:bg-gray-100">Khuyến mãi</Link>
                        <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">Liên hệ</Link>
                    </div>
                )}
            </div>

            {/* Logo */}

            {/* Main Nav (Hidden on mobile) */}
            <div className="hidden md:flex space-x-6">
                <Link onClick={() => setDropdownOpen(false)} to="/" className="hover:text-gray-200 transition duration-300">Trang chủ</Link>
                <Link onClick={() => setDropdownOpen(false)} to="/products" className="hover:text-gray-200 transition duration-300">Sản phẩm</Link>
                <Link onClick={() => setDropdownOpen(false)} to="/promotions" className="hover:text-gray-200 transition duration-300">Khuyến mãi</Link>
                <Link onClick={() => setDropdownOpen(false)} to="/contact" className="hover:text-gray-200 transition duration-300">Liên hệ</Link>
            </div>

            {/* User Dropdown */}
            <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                    <img src="/user-icon.png" alt="User" className="w-8 h-8 rounded-full" />
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 top-full bg-white text-black shadow-lg rounded-lg w-48 mt-2">
                        <Link to="/cart" onClick={() => setDropdownOpen(!dropdownOpen)} className="block px-4 py-2 hover:bg-gray-100">Giỏ hàng</Link>
                        {user ? (
                            <>
                                <Link to="/account-history" onClick={() => setDropdownOpen(!dropdownOpen)} className="block px-4 py-2 hover:bg-gray-100">Lịch sử đặt hàng</Link>
                                <button
                                    className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("data");
                                        window.location.href = "/login";
                                    }}
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Đăng nhập</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default UserNavbar;
