const express = require("express");
const app = express();

const usersRoute = require("./users.js");
const productRoute = require('./products.js')

app.use("/user", usersRoute);
app.use("/product", productRoute)

module.exports = app;
