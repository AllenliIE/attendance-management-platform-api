"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id from Users WHERE id <> 1;",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const attendanceSeed = users.map((user, i) => {
      const clockIn = new Date(
        new Date().getTime() - Math.floor(Math.random() * 600000)
      );
      const clockOut =
        Math.random() >= 0.2
          ? new Date(new Date().getTime() + Math.floor(Math.random() * 600000))
          : null;
      const elapsedTime = clockOut
        ? clockOut.getTime() - clockIn.getTime()
        : null;
      return {
        date: new Date(),
        user_id: user.id,
        clock_in: clockIn,
        clock_out: clockOut,
        elapsed_time: elapsedTime,
        absent: !clockOut,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert("Attendances", attendanceSeed, {});
  },
};
