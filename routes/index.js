const express = require("express");
const app = express();

const usersRoute = require("./users.js");

app.use("/user", usersRoute);

module.exports = app;
