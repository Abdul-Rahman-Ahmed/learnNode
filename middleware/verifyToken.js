const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const RequestStatus = require("../utils/httpRequestStatus");
const verify = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  const token = authHeader.split(" ")[1];
  if (!token) {
    const error = appError.create(
      "token is required",
      401,
      RequestStatus.ERROR
    );
    return next(error);
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    const error = appError.create("Invalid Token", 401, RequestStatus.FAIL);
    return next(error);
  }
};

module.exports = verify;
