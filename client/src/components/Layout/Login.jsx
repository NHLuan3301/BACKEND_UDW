import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/userApi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            const response = await loginUser({ email, password });
            localStorage.setItem("data", JSON.stringify(response.data.user));
            setMessage("Đăng nhập thành công!");
            setTimeout(() => navigate("/admin/products"), 3000);
        } catch (error) {
            setError("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Đăng nhập</h2>
                {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-lg font-semibold">
                        Đăng nhập
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Chưa có tài khoản?
                    <button onClick={() => navigate('/register')} className="text-red-500 font-bold ml-1 hover:underline">
                        Đăng ký ngay
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
