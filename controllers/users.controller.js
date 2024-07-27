const Users = require("../models/users.model");
const RequestStatus = require("../utils/httpRequestStatus");
const appError = require("../utils/appError");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
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
  const { firstName, lastName, email, password, role } = req.body;
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
  console.log(req.file.filename);
  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });
  const token = await newToken({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  res.status(201).json({ status: RequestStatus.SUCCESS, user: newUser });
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
    const token = await newToken({ email, id: user._id, role: user.role });
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
