const express = require("express");
const router = express.Router();
const Products = require("../models/productsModel");
const jwt = require("jsonwebtoken");

// getting all products
router.get("/", async (req, res) => {
  const data = await Products.find({});
  res.status(200).json(data);
});

// getting single product
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Products.findById(id);

  if (!data) {
    res.status(401).json({ message: "Product does not exist" });
    return;
  }

  res.status(200).json(data);
});

// creating product
router.post("/post", async (req, res) => {
  const { title, price, description, category, image } = req.body;

  if (!title || !price || !description || !category || !image) {
    res.status(400).json({ message: "You have not entered the req fields" });
    return;
  }

  const checkProduct = await Products.findOne({
    title: title,
  });

  if (checkProduct) {
    res.status(400).json({ message: "product already exists" });
    return;
  }

  // getting authtoken
  const authToken = req.headers.authtoken;

  // validating authtoken
  if (!authToken) {
    res.status(401).json({ message: "You are not Aurthorized" });
    return;
  }

  // decoding token
  const decodeToken = jwt.decode(authToken, process.env.SECRET_KEY);

  //console.log(decodeToken)
  //res.send("hello")

  if (decodeToken.role !== "admin") {
    res.status(401).json({ message: "You are not Authorized" });
    return;
  }

  const product = await Products.create({
    title: title,
    price: price,
    description: description,
    category: category,
    image: image,
  });
  res.status(200).json(product);
});

// updating product
router.put("/:id", async (req, res) => {
  const { title, price, description, category, image } = req.body;

  const checkProduct = await Products.findById(req.params.id);

  if (!checkProduct) {
    res.status(400).json({ message: "product does not exist" });
    return;
  }

  const authToken = req.headers.authtoken;

  if (!authToken) {
    res.status(401).json({ message: "You are not Aurthorized" });
    return;
  }

  const decodeToken = jwt.decode(authToken, process.env.SECRET_KEY);

  if (decodeToken.role !== "admin") {
    res.status(401).json({ message: "You are not Authorized" });
    return;
  }

  // updating
  const product = await Products.findByIdAndUpdate(
    req.params.id,
    {
      title: title,
      price: price,
      description: description,
      category: category,
      image: image,
    },
    { new: true }
  );

  res.status(200).json(product);
});

// deleting single product
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const authToken = req.headers.authtoken;

  if (!authToken) {
    res.status(401).json({ message: "You are not Aurthorized" });
    return;
  }

  const checkProduct = await Products.findById(id);
  if (!checkProduct) {
    res.status(400).json({ message: "product does not exist" });
    return;
  }

  const decodeToken = jwt.decode(authToken, process.env.SECRET_KEY);

  if (decodeToken.role !== "admin") {
    res.status(401).json({ message: "You are not Authorized" });
    return;
  }

  const data = await Products.findByIdAndDelete(id);

  res.status(200).json(data);
});

module.exports = router;
