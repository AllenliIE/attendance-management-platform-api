const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const userController = require("../controllers/user-controller");

const { apiErrorHandler } = require("../middleware/error-handler");

router.post("/api/signup", userController.signUp);
router.use("/", apiErrorHandler);

module.exports = router;
