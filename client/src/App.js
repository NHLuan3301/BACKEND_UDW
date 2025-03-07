import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/Layout/AdminLayout.jsx";
import UserLayout from "./components/Layout/UserLayout.jsx";
import HomePage from "./components/Layout/HomePage.jsx";
import Login from "./components/Layout/Login";
import Register from "./components/Layout/Register";
import ProductList from "./pages/user/ProductList.jsx";
import Promotions from "./pages/user/Promotions.jsx";
import Contact from "./pages/user/Contact.jsx";
import Cart from "./pages/user/Cart.jsx";
import Order from "./pages/user/Order.jsx";
import HistoryOrder from "./pages/user/HistoryOrder.jsx";

function App() {
  const user = JSON.parse(localStorage.getItem("data"));
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <Routes>
        {/* Các route dành cho admin */}
        {isAdmin && (
          <Route path="/admin/*" element={<AdminLayout />} />
        )}
        {/* Các route dành cho user */}
        <Route path="/*" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductList />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order" element={<Order />} />
          <Route path="account-history" element={<HistoryOrder />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;