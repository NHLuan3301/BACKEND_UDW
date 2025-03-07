const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/OrderRoutes.js");
const paymentRoutes = require("./routes/Payment.js");
const cartRoutes = require("./routes/Cart.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.akz6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {})
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/carts", cartRoutes);

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
