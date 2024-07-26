const { validationResult } = require("express-validator");
const Users = require("../models/users.model");
const RequestStatus = require("../utils/httpRequestStatus");
const appError = require("../utils/appError");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const newToken = require("../utils/newToken");

const getUsers = asyncWrapper(async (req, res) => {
  const users = await Users.find({}, { __v: false, password: false });
  return res.json({
    status: RequestStatus.SUCCESS,
    data: {
      users,
    },
  });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const oldUser = await Users.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "this user already exists",
      400,
      RequestStatus.FAIL
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(201).json({ status: RequestStatus.SUCCESS, data: newUser });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.create(
      "Email & Password is Required",
      400,
      RequestStatus.FAIL
    );
    return next(error);
  }
  const user = await Users.findOne({ email: email });
  if (!user) {
    const error = appError.create(
      "this user not exists",
      400,
      RequestStatus.FAIL
    );
    return next(error);
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  if (user && matchPassword) {
    const token = newToken({ email, id: user._id });
    return res.status(201).json({ status: RequestStatus.SUCCESS, token });
  } else {
    const error = appError.create("something wrong", 400, RequestStatus.FAIL);
    return next(error);
  }
});
module.exports = {
  getUsers,
  register,
  login,
};
