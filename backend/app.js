require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const passport = require("./config/passport");
const session = require("express-session");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(cors());
app.use(express.urlencoded({ extended: true })); //body-parser
app.use(express.json());
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.listen(port, () => {
  console.info(
    `Attendance-management-platform-api is listening on port:${port}!`
  );
});
