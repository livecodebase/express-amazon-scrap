const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_TOKEN;

const Auth = async (req, res, next) => {
  if (!req.header("Authorization"))
    return res.status(401).send({
      message: "Access Denied",
    });

  const Token = req.header("Authorization").replace("Bearer ", "");

  try {
    const data = jwt.verify(Token, accessTokenSecret);
    req.data = { user: data };
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({
      message: "Not Authorization",
    });
  }
};

module.exports = Auth;
