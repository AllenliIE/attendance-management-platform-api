"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userSeed = Array.from({ length: 10 }).map((_, i) => ({
      name: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      account: `user${i + 1}`,
      password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
      role: "user",
      wrong_times: 0,
      is_locked: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "admin",
          email: "admin@example.com",
          account: "admin",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          role: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...userSeed,
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
