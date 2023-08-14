const jwt = require("jsonwebtoken");

const verifyJwt = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send("Token is required");
  }

  let key = "webdemo";
  try {
    token = token.split(" ");
    let decode = jwt.verify(token[1], key);
    req._user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

module.exports = verifyJwt;
