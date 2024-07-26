const express = require("express");
const router = express.Router();
const coursesControllers = require("../controllers/courses.controller");
const valdite = require("../middleware/validate.middleware");

router
  .route("/")
  .get(coursesControllers.getCourses)
  .post(valdite(), coursesControllers.addCourse);

router
  .route("/:courseId")
  .get(coursesControllers.getCourse)
  .patch(coursesControllers.editCourse)
  .delete(coursesControllers.deleteCourse);

module.exports = router;
