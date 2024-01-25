const express = require("express");
const app = express();
const connection = require("./dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");

connection();

app.use(express.json());

app.use(cors());

app.use("/auth", require("./routes/Authentication"));
app.use("/products", require("./routes/Products"));
app.use("/cart", require("./routes/AddToCart"));

app.listen(process.env.PORT, () => {
  console.log("listening on port", process.env.PORT);
});
