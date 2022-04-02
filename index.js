const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require('morgan')

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/mongo')

const routes = require("./routes/index.js");

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).send({
    message: "404 not found",
  });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
