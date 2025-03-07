const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment.js");

// 📜 Lấy danh sách thanh toán
router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách thanh toán", error });
    }
});

// 🔍 Tìm kiếm thanh toán theo OrderId
router.get("/search", async (req, res) => {
    try {
        const { orderId } = req.query;
        if (!orderId) {
            return res
                .status(400)
                .json({ message: "Vui lòng cung cấp OrderId để tìm kiếm" });
        }

        const payments = await Payment.find({
            orderId: orderId,
        });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tìm kiếm thanh toán", error });
    }
});

// ➕ Tạo thanh toán mới
router.post("/", async (req, res) => {
    try {
        const { orderId, amount, paymentMethod, paymentDate } = req.body;
        if (!orderId || !amount || !paymentMethod || !paymentDate) {
            return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
        }
        const newPayment = new Payment({
            orderId,
            amount,
            paymentMethod,
            paymentDate,
        });

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        console.error("Lỗi khi thêm thanh toán:", error);
        res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ", error });
    }
});

// ✏️ Cập nhật thông tin thanh toán
router.put("/:id", async (req, res) => {
    const { orderId, amount, paymentMethod, paymentDate } = req.body;
    const paymentId = req.params.id; // Lấy ID của thanh toán từ URL

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { orderId, amount, paymentMethod, paymentDate },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Thanh toán không tồn tại" });
        }

        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật thanh toán", error });
    }
});

// 🗑️ Xóa thanh toán
router.delete("/:id", async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);

        if (!deletedPayment) {
            return res.status(404).json({ message: "Thanh toán không tồn tại" });
        }

        res.json({ message: "Xóa thanh toán thành công", deletedPayment });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa thanh toán", error });
    }
});

module.exports = router;