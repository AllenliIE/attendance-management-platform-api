'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    date: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    clockIn: DataTypes.DATE,
    clockOut: DataTypes.DATE,
    elapsedTime: DataTypes.INTEGER,
    absent: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  Attendance.associate = function(models) {
    // associations can be defined here
  };
  return Attendance;
};