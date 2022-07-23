const Category = require("../../models/categories");
const { Op } = require("sequelize");

const getCategories = (req, res) => {
  Category.findAll({
    attributes: ["id", "category", "id_type"],
    raw: true,
    nest: true,
  })
    .then((categories) => {
      res.status(200).json({
        status: "success",
        message: "Successfully get categories!",
        data: categories,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

const createCategory = (req, res) => {
  const { category, id_type } = req.body;
  Category.create({
    category,
    id_type,
  })
    .then((category) => {
      res.status(200).json({
        status: "success",
        message: "Successfully create category!",
        data: category,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

const deleteCategory = (req, res) => {
  const { id } = req.params;

  Category.destroy({
    where: {
      id: id,
    },
  })
    .then((category) => {
      res.status(200).json({
        status: "success",
        message: "Successfully delete category!",
        data: category,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

const searchCategory = (req, res) => {
  const { category } = req.query;

  Category.findAll({
    attributes: ["id", "category"],
    raw: true,
    nest: true,
    where: {
      category: {
        [Op.like]: `%${category}%`,
      },
    },
  })
    .then((categories) => {
      res.status(200).json({
        status: "success",
        message: "Successfully search category!",
        data: categories,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Something went wrong!",
      });
    });
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  searchCategory,
};
