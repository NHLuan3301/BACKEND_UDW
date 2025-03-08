const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
});
// ➕ Tạo sản phẩm mới (Kiểm tra company trước khi tạo)
router.post("/", async (req, res) => {
  try {
    const { name, price, image, stock, description } = req.body;

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

// ✏️ Cập nhật sản phẩm (Kiểm tra nếu có cập nhật)
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, // nhan vao id san pham tu param
      req.body, // nhan du lieu san pham update tu body
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
// Phan trang
router.get("/search", async (req, res) => {
  try {
    // lay du lieu tu nguoi dung truyen vao de xu ly
    let { page, limit, sortBy, order, keyword } = req.query;

    // Chuyển đổi page và limit sang kiểu số nguyên, mặc định page = 1, limit = 10 nếu không có giá trị từ client
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Xác định thứ tự sắp xếp: nếu order = "desc" thì -1 (giảm dần), ngược lại là 1 (tăng dần)
    order = order === "desc" ? -1 : 1;

    // Tính toán số lượng bản ghi cần bỏ qua để phân trang (skip)
    const skip = (page - 1) * limit;

    // Tạo bộ lọc tìm kiếm: nếu có từ khóa keyword thì tìm các sản phẩm có tên chứa từ khóa đó (không phân biệt hoa/thường)
    const filter = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

    // Truy vấn danh sách sản phẩm từ database dựa trên bộ lọc và phân trang
    const products = await Product.find(filter)
      .sort({ [sortBy]: order }) // Sắp xếp theo trường sortBy với thứ tự order
      .skip(skip) // Bỏ qua số lượng bản ghi tương ứng với trang hiện tại
      .limit(limit); // Giới hạn số lượng sản phẩm trả về trên một trang

    // Đếm tổng số sản phẩm khớp với điều kiện tìm kiếm
    const totalProducts = await Product.countDocuments(filter);

    // Tính tổng số trang (làm tròn lên)
    const pageCount = Math.ceil(totalProducts / Number(limit));

    // Trả về dữ liệu dưới dạng JSON
    res.json({
      products: products, // Danh sách sản phẩm
      totalProducts: totalProducts, // Tổng số sản phẩm
      pageCount: pageCount, // Tổng số trang
    });
  } catch (error) {
    // Xử lý lỗi nếu có vấn đề trong quá trình truy vấn
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
});

module.exports = router;
