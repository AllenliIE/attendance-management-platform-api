"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User);
    }
  }
  Attendance.init(
    {
      date: DataTypes.DATE,
      UserId: DataTypes.INTEGER,
      clockIn: DataTypes.DATE,
      clockOut: DataTypes.DATE,
      elapsedTime: DataTypes.INTEGER,
      absent: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "Attendances",
      underscored: true,
    }
  );
  return Attendance;
};
