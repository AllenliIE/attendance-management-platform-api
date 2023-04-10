"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Attendances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      clock_in: {
        type: Sequelize.DATE,
      },
      clock_out: {
        type: Sequelize.DATE,
      },
      elapsed_time: {
        type: Sequelize.INTEGER,
      },
      absent: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Attendances");
  },
};
