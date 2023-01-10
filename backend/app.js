const express = require("express");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })) 
app.use(routes);
app.listen(port, () => {
  console.info(`Attendance-Management-Platform-API listening on port:${port}!`);
});

module.exports = app;
