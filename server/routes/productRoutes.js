const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
});
// ➕ Tạo sản phẩm mới (Kiểm tra company trước khi tạo)
router.post("/", async (req, res) => {
  try {
    const { name, price, image, stock, description } =
      req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }


    const newProduct = new Product({
      name,
      price,
      image,
      stock,
      description,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ", error });
  }
});

// ✏️ Cập nhật sản phẩm (Kiểm tra company nếu có cập nhật)
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
});

// 🗑️ Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json({ message: "Xóa sản phẩm thành công", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
});

router.get("/search", async (req, res) => {
  try {
    let { page, limit, sortBy, order, keyword } = req.query;
    page = parseInt(page) || 1; // Mặc định trang 1
    limit = parseInt(limit) || 10; // Mặc định lấy 10 sản phẩm mỗi trang
    order = order === "desc" ? -1 : 1; // Mặc định tăng dần (asc)

    const skip = (page - 1) * limit;
    const filter = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

    const products = await Product.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
});
module.exports = router;
