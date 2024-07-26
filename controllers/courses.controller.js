const { validationResult } = require("express-validator");
const Course = require("../models/cources.model");
const RequestStatus = require("../utils/httpRequestStatus");
const appError = require("../utils/appError");
const asyncWrapper = require("../middleware/asyncWrapper");

const getCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 20;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  return res.json({
    status: RequestStatus.SUCCESS,
    data: {
      courses,
    },
  });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId, { __v: false });
  if (!course) {
    const error = appError.create("course not Found", 404, RequestStatus.FAIL);
    return next(error);
  }
  return res.status(200).json({
    status: RequestStatus.SUCCESS,
    data: {
      courses: {
        course,
      },
    },
  });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errorValidation = validationResult(req);
  if (!errorValidation.isEmpty()) {
    const error = appError.create(
      errorValidation.array(),
      400,
      RequestStatus.FAIL
    );
    return next(error);
  }
  const course = new Course(req.body);
  await course.save();
  res.status(201).json({ status: RequestStatus.SUCCESS, data: course });
});

const editCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findByIdAndUpdate(courseId, {
    $set: req.body,
  });
  if (!course) {
    const error = appError.create("course not Found", 404, RequestStatus.FAIL);
    return next(error);
  }
  return res.status(200).json({
    status: RequestStatus.SUCCESS,
    data: {
      message: "modify course is done",
    },
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    const error = appError.create("course not Found", 404, RequestStatus.FAIL);
    return next(error);
  }
  return res.status(200).json({
    status: RequestStatus.SUCCESS,
    data: {
      message: "delete course is done",
    },
  });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  editCourse,
  deleteCourse,
};
