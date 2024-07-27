const appError = require("../utils/appError");
const RequestStatus = require("../utils/httpRequestStatus");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(
        appError.create(
          "this is user not allowed to delete",
          401,
          RequestStatus.ERROR
        )
      );
    }
    next();
  };
};
