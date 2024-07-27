const jwt = require("jsonwebtoken");

const token = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
  return token;
};

module.exports = token;
