const express = require("express");
const router = express.Router();

const admin = require('./modules/admin')
const attendController = require("../controllers/attendance-controller");
const userController = require('../controllers/user-controller') 

router.use('/admin', admin)
router.get("/attendance", attendController.getAttendance);
router.post('/signup', userController.signUp)
router.use("/", (req, res) => res.redirect("/attendance"));

module.exports = router;
