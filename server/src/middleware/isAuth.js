const jwt = require("jsonwebtoken");

exports.isAdmin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. silahkan sign in terlebih dahulu",
      });
    } else if (decoded.level !== "admin" && decoded.level !== "head") {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. only admin can access this resource",
      });
    }
    req.decoded = decoded;
    next();
  });
};

exports.isTeam = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. silahkan sign in terlebih dahulu",
      });
    } else if (decoded.level !== "team") {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. only team can access this resource",
      });
    }
    req.decoded = decoded;
    next();
  });
};

exports.isAuth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized. silahkan sign in terlebih dahulu",
      });
    }
    req.decoded = decoded;
    next();
  });
};
