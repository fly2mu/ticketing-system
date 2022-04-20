const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-mssql");

const Employee = sequelize.define("employee", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeid: DataTypes.STRING,
  dateofbirth: DataTypes.DATE,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Employee;
