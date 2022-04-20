const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("categorie", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  category: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Category;
