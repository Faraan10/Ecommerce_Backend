const mongoose = require("mongoose");

const CartModel = mongoose.Schema({
  username: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, default: 1 },
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("cart", CartModel);
