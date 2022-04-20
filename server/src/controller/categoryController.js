const Category = require("../../models/categories");

const getCategories = (req, res) => {
  Category.findAll({
    attributes: ["id", "category"],
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
  const { category } = req.body;
  Category.create({
    category,
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

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};
