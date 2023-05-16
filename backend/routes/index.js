const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const userController = require("../controllers/user-controller");
const attendanceController = require("../controllers/attendance-controller");
const adminController = require("../controllers/admin-controller");

const { apiErrorHandler } = require("../middleware/error-handler");
const { authenticated, authenticatedAdmin } = require("../middleware/api-auth");

router.get(
  "/api/admin/attendance/dashboard",
  authenticated,
  authenticatedAdmin,
  adminController.getDashboard
);
router.put(
  "/api/admin/attendance/:id",
  authenticated,
  authenticatedAdmin,
  adminController.putAbsent
);
router.get(
  "/api/admin/attendance",
  authenticated,
  authenticatedAdmin,
  adminController.getAttendance
);
router.put(
  "/api/admin/attendance/users/:id",
  authenticated,
  authenticatedAdmin,
  adminController.unlockUser
);
router.get(
  "/api/admin/attendance/users",
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
);

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

router.get(
  "/api/attendance",
  authenticated,
  attendanceController.getAttendance
);
router.post(
  "/api/attendance",
  authenticated,
  attendanceController.postAttendance
);
router.put(
  "/api/attendance/:id",
  authenticated,
  attendanceController.updateAttendance
);

router.post("/api/signin", userController.signIn);
router.post("/api/signup", userController.signUp);
router.use("/", apiErrorHandler);

module.exports = router;
