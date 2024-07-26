const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users.controller");
const verify = require("../middleware/verifyToken");

router.get("/", verify, usersControllers.getUsers);
router.post("/register", usersControllers.register);
router.post("/login", usersControllers.login);

module.exports = router;
