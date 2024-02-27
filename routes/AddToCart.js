const express = require("express");
const router = express.Router();
const Cart = require("../models/CartModel");
const Product = require("../models/productsModel");
const jwt = require("jsonwebtoken");

// getting cart
router.get("/", async (req, res) => {
	const token = req.headers.authtoken;
	const authtoken = jwt.decode(token, process.env.SECRET_KEY);
	const username = authtoken.username;
	const cart = await Cart.find({ username });
	// just checking if data is receiving or not
	//console.log(authtoken);
	res.json(cart);
});

// posting cart
router.post("/", async (req, res) => {
	const token = req.headers.authtoken;
	const productId = req.headers.productid;

	// decoding user
	const authtoken = jwt.decode(token, process.env.SECRET_KEY);
	const username = authtoken.username;

	// check cart
	const checkCart = await Cart.findOne({ username, productId });
	if (checkCart) {
		res.status(400).json({ message: "Item already added to the cart" });
		return;
	}

	const { quantity } = req.body;

	const product = await Product.findById(productId);
	//console.log(product);
	const cart = await Cart.create({
		username,
		productId,
		quantity,
		title: product.title,
		price: product.price,
		description: product.description,
		image: product.image,
	});
	res.status(200).json(cart);
});

//
// updating cart
router.put("/", async (req, res) => {
	// get quantity from body

	const { quantity } = req.body;

	if (!quantity) {
		res.status(401).json({ message: "Enter the quantity" });
		return;
	}

	// get authtoken and cartid from headers
	const token = req.headers.authtoken;
	const cartId = req.headers.cartid;

	if (!token) {
		res.status(401).json({ message: "You are not authorized1" });
		return;
	}

	if (!cartId) {
		res.status(401).json({ message: "You are not authorized2" });
		return;
	}

	// token decode
	const authtoken = jwt.decode(token, process.env.SECRET_KEY);

	// get cart details

	const cart = await Cart.findById(cartId);

	if (!cart) {
		res.status(401).json({ message: "You are not authorized3" });
		return;
	}

	// token username == cartId. username

	if (authtoken.username !== cart.username) {
		res.status(401).json({ message: "you are not authorized4" });
		return;
	}

	// update

	const updateCart = await Cart.findByIdAndUpdate(cartId, { quantity }, { new: true });
	res.status(200).json(updateCart);
});

//
// deleting cart
router.delete("/", async (req, res) => {
	// get token and cartId from headers
	const token = req.headers.authtoken;
	const cartId = req.headers.cartid;

	if (!token) {
		res.status(401).json({ message: "You are not authorized" });
		return;
	}

	if (!cartId) {
		res.status(401).json({ message: "You are not authorized" });
		return;
	}

	// token decode
	const authtoken = jwt.decode(token, process.env.SECRET_KEY);

	// get cart details

	const cart = await Cart.findById(cartId);

	if (!cart) {
		res.status(401).json({ message: "You are not authorized" });
		return;
	}

	// token username == cartId. username

	if (authtoken.username !== cart.username) {
		res.status(401).json({ message: "you are not authorized" });
		return;
	}

	deleteCart = await Cart.findByIdAndDelete(cartId);
	res.status(200).json(deleteCart);
});

module.exports = router;
