const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true }, // Mô tả sản phẩm
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, trim: true }, // URL ảnh sản phẩm
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
