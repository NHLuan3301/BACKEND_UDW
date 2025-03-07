const express = require("express");
const router = express.Router();
const Order = require("../models/Order.js");

// 📜 Lấy danh sách đơn hàng
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error });
  }
});

// 🔍 Tìm kiếm đơn hàng theo UserId
router.get("/search", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp UserId để tìm kiếm" });
    }

    const orders = await Order.find({ userId })
      .populate("userId")
      .populate("products.productId"); // 🛠️ Sửa để populate sản phẩm trong mảng

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm đơn hàng", error });
  }
});

// ➕ Tạo đơn hàng mới
router.post("/", async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentMethod, orderDate } =
      req.body;

    if (
      !totalAmount ||
      !paymentMethod ||
      !orderDate ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentMethod,
      status: "Chưa thanh toán",
      orderDate,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Lỗi khi thêm đơn hàng:", error);
    res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ", error });
  }
});

// ✏️ Cập nhật thông tin đơn hàng
router.put("/:id", async (req, res) => {
  const { totalAmount, paymentMethod, status, orderDate } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { totalAmount, paymentMethod, status, orderDate },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng", error });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json({ message: "Xóa đơn hàng thành công", deletedOrder });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error });
  }
});

module.exports = router;
