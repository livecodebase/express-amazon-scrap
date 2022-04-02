const { Router } = require("express");
const router = Router();
const Auth = require("../middleware/Auth");

const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_TOKEN;

const bcrypt = require("bcrypt");
const saltRounds = 10;
const UserModal = require("../models/user");

router.post("/register", async (req, res) => {
  let user = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  if (!user.name || !user.username || !user.email || !user.password) {
    return res.status(401).send({ message: `Please enter user details` });
  }
  let existingUser = await UserModal.findOne({$or:[{username: user.username},{email: user.email}]})
  if (existingUser) {
    return res.status(401).send({ message: 'User already exists' });
  }
  try {
    bcrypt.hash(user.password, saltRounds, async (err, hash) => {
      if (err) {
        res.status(404).send({ message: `${err}` });
      }
      user.password = hash;
      await UserModal.create(user);
      let userData = {
        name: user.name,
        username: user.username,
        email: user.email
      }
      const token = jwt.sign({ ...userData }, accessTokenSecret);
      return res.status(200).send({ access_token: token});
    });
  } catch (error) {
    return res.status(404).send({ message: `${error}` });
  }
});

router.get("/", Auth, async (req, res) => {
  try {
    const user = req.data.user;
    res.status(200).send({ name: user.name, email: user.email, username: user.username });
  } catch (err) {
    res.status(404).send({ message: "Authorization error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(404).send({ message: `Please enter your details` });
  }

  try {
    await UserModal.findOne({$or:[{username: username}, {email: username}]})
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
        }

        bcrypt.compare(password, user.password, function (err, result) {
          if (result == true) {
            let userData = {
              name: user.name,
              username: user.username,
              email: user.email
            }
            const token = jwt.sign({ ...userData }, accessTokenSecret);
            res.header("auth-token", token).status(200).send({
              access_token: token,
              token: token,
              user: {name: user.name, email: user.email, username: user.username}
            });
          } else {
            res.status(401).send({ message: "Incorrect password" });
          }
        });
      })
      .catch((err) => {
        res.status(404).send({ message: `${err}` });
      });
  } catch (error) {
    res.status(404).send({ message: `${error}` });
  }
});

router.get("/logout", Auth, async (req, res) => {
  res.status(200).send({ message: "User logged out successfully" });
});


module.exports = router;
