const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const userController = require("../controllers/user-controller");

const { apiErrorHandler } = require("../middleware/error-handler");
const { authenticated, authenticatedAdmin } = require("../middleware/api-auth");

router.post("/api/signin", userController.signIn);
router.post("/api/signup", userController.signUp);
router.use("/", apiErrorHandler);

module.exports = router;
