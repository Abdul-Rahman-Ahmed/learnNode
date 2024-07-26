const jwt = require("jsonwebtoken");

const token = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
  return token;
};

module.exports = token;
