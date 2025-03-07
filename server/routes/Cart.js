const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart.js");

// 📜 Lấy danh sách giỏ hàng
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giỏ hàng", error });
  }
});

// 🔍 Tìm kiếm giỏ hàng theo UserId
router.get("/search", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp UserId để tìm kiếm" });
    }

    const carts = await Cart.find({
      userId: userId,
    }).populate("productId").populate("userId");

    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm giỏ hàng", error });
  }
});

// ➕ Tạo giỏ hàng mới
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Thiếu thông tin giỏ hàng" });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      // Nếu đã tồn tại, cập nhật số lượng
      existingCartItem.quantity += quantity;
      const updatedCart = await existingCartItem.save();
      return res.status(200).json(updatedCart);
    }

    // Nếu chưa tồn tại, thêm mới
    const newCart = new Cart({
      userId,
      productId,
      quantity,
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error("Lỗi khi thêm giỏ hàng:", error);
    res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ", error });
  }
});


// ✏️ Cập nhật thông tin giỏ hàng
router.put("/:id", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const cartId = req.params.id; // Lấy ID của giỏ hàng từ URL

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { userId, productId, quantity },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error });
  }
});

// 🗑️ Xóa giỏ hàng
router.delete("/:id", async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedCart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    res.json({ message: "Xóa giỏ hàng thành công", deletedCart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng", error });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ message: "Xóa tất cả giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa tất cả giỏ hàng", error });
  }
})
module.exports = router;