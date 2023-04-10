const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const userController = require("../controllers/user-controller");
const attendanceController = require("../controllers/attendance-controller");

const { apiErrorHandler } = require("../middleware/error-handler");
const { authenticated, authenticatedAdmin } = require("../middleware/api-auth");

router.get(
  "/api/get_current_user",
  authenticated,
  userController.getCurrentUser
);
router.put(
  "/api/clocking/user/:id/edit",
  authenticated,
  userController.putProfile
);

router.post(
  "/api/attendance",
  authenticated,
  attendanceController.postAttendance
);

router.post("/api/signin", userController.signIn);
router.post("/api/signup", userController.signUp);
router.use("/", apiErrorHandler);

module.exports = router;
