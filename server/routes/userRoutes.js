const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Lấy danh sách user
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
    }
});

// Thêm user mới
router.post("/", async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;
        const newUser = new User({ username, email, phone, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm người dùng", error });
    }
});

// Cập nhật user
router.put("/:id", async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, phone, password, role },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error });
    }
});

// Xóa user
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa người dùng", error });
    }
});

// Đăng ký người dùng
router.post("/register", async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        console.log(req.body);

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Tạo user mới
        const newUser = new User({ username, email, phone, password, role: "user" });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng ký", error });
    }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        // Kiểm tra mật khẩu 
        if (user.password !== password) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        res.json({ message: "Đăng nhập thành công", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng nhập", error });
    }
});
module.exports = router;
