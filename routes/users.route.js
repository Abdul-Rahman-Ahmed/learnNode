const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users.controller");
const verify = require("../middleware/verifyToken");
const multer = require("multer");
const appError = require("../utils/appError");
const RequestStatus = require("../utils/httpRequestStatus");

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});
const isImage = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    cb(appError.create("must be image", 400, RequestStatus.FAIL), false);
  }
};
const upload = multer({ storage: Storage, fileFilter: isImage });

router.get("/", verify, usersControllers.getUsers);
router.post("/register", upload.single("avatar"), usersControllers.register);
router.post("/login", usersControllers.login);

module.exports = router;
