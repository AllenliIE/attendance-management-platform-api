const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/admin-controller");

router.get("/attendance", adminController.getAttendance);
router.use("/", (req, res) => res.redirect("/admin/attendance"));

module.exports = router;
