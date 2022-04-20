const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Requests = require("./request");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  level: DataTypes.STRING,
  last_login: DataTypes.DATE,
  image_login: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

User.hasMany(Requests, {
  foreignKey: "id_user",
  sourceKey: "id",
});

module.exports = User;
