const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// getting all users
router.get("/", async (req, res) => {
  const data = await User.find({});
  res.status(200).json(data);
});

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res
      .status(400)
      .json({ message: "You have not entered the required fields" });
    return;
  }

  const checkUser = await User.findOne({
    email: email,
  });

  if (checkUser) {
    res.status(400).json({ message: "this email already exists" });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // creating user
  const createUser = await User.create({
    username: username,
    email: email,
    password: hashPassword,
    role: role,
  });

  // res.status(200).json(createUser);

  // signing in user
  const token = jwt.sign(
    {
      username: createUser.username,
      email: createUser.email,
      role: createUser.role,
    },
    process.env.SECRET_KEY
  );
  res.status(201).json({ token });
});

//logging in user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ message: "You have not entered the required fields" });
    return;
  }
  const findUser = await User.findOne({
    email: email,
  });

  if (!findUser) {
    res.status(400).json({ message: "Invalid login credentials" });
    return;
  }

  const comparePassword = await bcrypt.compare(password, findUser.password);

  if (!comparePassword) {
    res.status(400).json({ message: "Invalid login credentials" });
    return;
  }

  // signing in the user
  const token = jwt.sign(
    {
      username: findUser.username,
      email: findUser.email,
      role: findUser.role,
    },
    process.env.SECRET_KEY
  );

  res.status(200).json({ token });
});

// get user
router.get("/getUser", async (req, res) => {
  const token = req.headers.authtoken;
  const authtoken = jwt.decode(token, process.env.SECRET_KEY);

  res.status(200).json({ authtoken });
});

module.exports = router;
