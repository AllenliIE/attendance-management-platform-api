require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DEV_DB_username,
    password: process.env.DEV_DB_password,
    database: process.env.DEV_DB_database,
    host: process.env.DEV_DB_host,
    dialect: process.env.DEV_DB_dialect,
    timezone: process.env.DEV_DB_timezone,
  },
  test: {
    username: process.env.TEST_DB_username,
    password: process.env.TEST_DB_password,
    database: process.env.TEST_DB_database,
    host: process.env.TEST_DB_host,
    dialect: process.env.TEST_DB_dialect,
    timezone: process.env.TEST_DB_timezone,
  },
  production: {
    use_env_variable: "CLEARDB_DATABASE_URL",
  },
};
