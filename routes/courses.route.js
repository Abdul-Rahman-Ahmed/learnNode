const express = require("express");
const router = express.Router();
const coursesControllers = require("../controllers/courses.controller");
const valdite = require("../middleware/validate.middleware");
const verify = require("../middleware/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowdTo");

router
  .route("/")
  .get(coursesControllers.getCourses)
  .post(valdite(), coursesControllers.addCourse);

router
  .route("/:courseId")
  .get(coursesControllers.getCourse)
  .patch(coursesControllers.editCourse)
  .delete(verify, allowedTo(userRoles.ADMIN), coursesControllers.deleteCourse);

module.exports = router;
