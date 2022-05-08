const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const UserAdmin = require("../../models/user_admin");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      fullname: user.full_name,
      email: user.email,
      level: user.level,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// const loginAdmin = async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ where: { username: username } });

//   if (!user) {
//     return res.status(400).json({
//       status: "failed",
//       message: "Failed to login!",
//     });
//   }

//   const token = createToken({
//     id: user.id,
//     username: user.username,
//     email: user.email,
//     level: user.level,
//   });

//   res.status(200).json({
//     status: "success",
//     message: "Login successfully!",
//     data: {
//       username: username,
//       level: "admin",
//       token: token,
//     },
//   });
// };

const loginUser = async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findOne({
    where: { username: username },
    attributes: ["id", "username", "email", "level"],
  });

  const user_admin = await UserAdmin.findOne({
    where: { username: username },
    attributes: ["id", "full_name", "username", "email", "level"],
  });

  if (user) {
    if (email !== user.email) {
      return res.status(400).json({
        status: "failed",
        message: "email tidak sesuai!",
      });
    }

    const token = await createToken({
      id: user.id,
      username: user.username,
      email: user.email,
      level: user.level,
    });

    res.status(200).json({
      status: "success",
      message: "Login successfully!",
      data: {
        username: username,
        level: user.level,
        email: user.email,
        token: token,
      },
    });
  } else if (user_admin) {
    if (email !== user_admin.email) {
      return res.status(400).json({
        status: "failed",
        message: "email tidak sesuai!",
      });
    }

    const token = await createToken({
      id: user_admin.id,
      full_name: user_admin.full_name,
      username: user_admin.username,
      email: user_admin.email,
      level: user_admin.level,
    });

    res.status(200).json({
      status: "success",
      message: "Login successfully!",
      data: {
        username: user_admin.username,
        fullname: user_admin.full_name,
        level: user_admin.level,
        email: user_admin.email,
        token: token,
      },
    });
  } else {
    const checkEmail = await User.findOne({
      where: { email: email },
      attributes: ["email", "level"],
    });

    if (checkEmail) {
      return res.status(400).json({
        status: "failed",
        message: "username tidak sesuai!",
      });
    }

    const addUser = await User.create({
      username: username,
      email: email,
      level: "user",
      last_login: new Date(),
    });

    const token = createToken({
      id: addUser.id,
      username: addUser.username,
      email: addUser.email,
      level: addUser.level,
    });

    return res.status(200).json({
      status: "success",
      message: "Login successfully!",
      data: {
        username: username,
        level: "user",
        email: email,
        token: token,
      },
    });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "username", "email", "level"],
    where: {
      username: {
        [Op.ne]: "admin",
      },
    },
    raw: true,
    nest: true,
  });

  res.status(200).json({
    status: "success",
    message: "Get all users successfully!",
    data: users,
  });
};

const getAllUserWithUsernameTeam = async (req, res) => {
  // get all user data with level = team
  const users = await UserAdmin.findAll({
    attributes: ["id", "full_name", "username", "email", "level"],
    where: {
      level: "team",
    },

    raw: true,
    nest: true,
  });

  if (!users) {
    return res.status(400).json({
      status: "failed",
      message: "Failed to get all users!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Get all users successfully!",
    data: users,
  });
};

const getAllUserAdmin = async (req, res) => {
  const users = await UserAdmin.findAll({
    attributes: ["id", "full_name", "username", "email", "level"],
    where: { level: "admin" },
    raw: true,
    nest: true,
  });

  if (!users) {
    return res.status(400).json({
      status: "failed",
      message: "Failed to get all users!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Get all users successfully!",
    data: users,
  });
};

const createUser = async (req, res) => {
  const { full_name, username, email, level } = req.body;

  if (level == "admin" || level == "team") {
    await UserAdmin.create({
      full_name: full_name,
      username: username,
      email: email,
      level: level,
    })
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully create new user!",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "failed",
          message: "Something went wrong!",
        });
      });
  } else {
    await User.create({
      username: username,
      email: email,
      level: level,
    })
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully create new user!",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "failed",
          message: "Something went wrong!",
        });
      });
  }
};

const deleteUserById = async (req, res) => {
  const { id_user, level } = req.params;

  if (level == "admin" || level == "team") {
    await UserAdmin.destroy({ where: { id: id_user } })
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully create new user!",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "failed",
          message: "Something went wrong!",
        });
      });
  } else {
    await User.destroy({ where: { id: id_user } })
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully create new user!",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "failed",
          message: "Something went wrong!",
        });
      });
  }
};

const updateUser = async (req, res) => {
  const { id_user } = req.params;
  const { full_name, username, email, level } = req.body;

  if (level == "user") {
    if (level == "admin" || level == "team") {
      // create new user to user admin
      await UserAdmin.create({
        full_name: full_name,
        username: username,
        email: email,
        level: level,
      })
        .then((result) => {
          User.destroy({ where: { id: id_user } });
          res.status(200).json({
            status: "success",
            message: "Successfully update user!",
            data: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: "failed",
            message: "Something went wrong!",
          });
        });
    } else {
      await User.update(
        {
          username: username,
          email: email,
        },
        { where: { id: id_user } }
      )
        .then((result) => {
          res.status(200).json({
            status: "success",
            message: "Successfully update user!",
            data: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: "failed",
            message: "Something went wrong!",
          });
        });
    }
  } else {
    await UserAdmin.update(
      {
        full_name: full_name,
        username: username,
        email: email,
      },
      { where: { id: id_user } }
    )
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully update user!",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "failed",
          message: "Something went wrong!",
        });
      });
  }
};

const getLevelUserCount = async (req, res) => {
  try {
    const userCount = await User.count({ where: { level: "user" } });

    res.status(200).json({
      status: "success",
      message: "Get all users successfully!",
      data: userCount,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: "failed",
      message: "Failed to get all users!",
    });
  }
};

const getLevelTeamCount = async (req, res) => {
  try {
    const userCount = await UserAdmin.count({ where: { level: "team" } });

    res.status(200).json({
      status: "success",
      message: "Get all users successfully!",
      data: userCount,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: "failed",
      message: "Failed to get all users!",
    });
  }
};

// const searchUserAdmin = async (req, res) => {
//   const { user } = req.query;

//   const users = await UserAdmin.findAll({
//     attributes: ["id", "full_name", "username", "email", "level"],
//     where: {
//       [Op.or]: [
//         { full_name: { [Op.like]: `%${user}%` } },
//         { username: { [Op.like]: `%${user}%` } },
//         { email: { [Op.like]: `%${user}%` } },
//       ],
//     },
//   });

//   if (users.length == 0) {
//     return res.status(400).json({
//       status: "failed",
//       message: "User not found!",
//     });
//   }

//   return res.status(200).json({
//     status: "success",
//     message: "Get all users successfully!",
//     data: users,
//   });
// };

const searchUser = async (req, res) => {
  const { user, level } = req.query;
  let users;

  if (level == "true") {
    users = await UserAdmin.findAll({
      attributes: ["id", "full_name", "username", "email", "level"],
      where: {
        [Op.or]: [
          { full_name: { [Op.like]: `%${user}%` } },
          { username: { [Op.like]: `%${user}%` } },
          { email: { [Op.like]: `%${user}%` } },
        ],
      },
    });

    if (users.length == 0) {
      return res.status(400).json({
        status: "failed",
        message: "User not found!",
      });
    }
  } else {
    users = await User.findAll({
      attributes: ["id", "username", "email", "level"],
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${user}%` } },
          { email: { [Op.like]: `%${user}%` } },
        ],
      },
    });

    if (users.length == 0) {
      return res.status(400).json({
        status: "failed",
        message: "User not found!",
      });
    }
  }

  return res.status(200).json({
    status: "success",
    message: "Get all users successfully!",
    data: users,
  });
};

module.exports = {
  // loginAdmin,
  loginUser,
  getAllUsers,
  getAllUserWithUsernameTeam,
  getLevelUserCount,
  getLevelTeamCount,
  getAllUserAdmin,
  createUser,
  deleteUserById,
  updateUser,
  // searchUserAdmin,
  searchUser,
};
